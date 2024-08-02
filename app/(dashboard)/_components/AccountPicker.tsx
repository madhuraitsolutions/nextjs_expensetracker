"use client";

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Account } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import CreateAccountDialog from './CreateAccountDialog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onChange: (value: string) => void;
}

function AccountPicker({ onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!value) return;
    onChange(value); // When the value changes, call the `onChange` callback
  }, [onChange, value]);

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: () => fetch(`/api/accounts`)
      .then((res) => res.json()),
  })

  const selectedAccount = accountsQuery.data?.find(
    (account: Account) => account.name === value
  );

  const successCallback = useCallback((account: Account) => {
    setValue(account.name);
    setOpen((prev) => !prev);
  }, [setValue, setOpen]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedAccount ? (
            <AccountRow account={selectedAccount} />
          ) : ("Select Account")}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command onSubmit={e => { e.preventDefault() }}>
          <CommandInput placeholder="Search account..." />
          <CreateAccountDialog successCallback={successCallback} />
          <CommandList>
            <CommandEmpty>
              <p>Account Not Found</p>
              <p className='text-xs text-muted-foreground'>
                Tip: create a new account
              </p>
            </CommandEmpty>
            <CommandGroup>
              {accountsQuery.data &&
                accountsQuery.data.map((account: Account) => (
                  <CommandItem
                    key={account.name}
                    onSelect={() => {
                      setValue(account.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <AccountRow account={account} />
                    <Check
                      className={cn(
                        'w-4 h-4 opacity-0',
                        value === account.name && 'opacity-100'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default AccountPicker

function AccountRow({ account }: { account: Account }) {
  return (
    <div className=''>
      <span>{account.name}</span>
    </div>
  )
}