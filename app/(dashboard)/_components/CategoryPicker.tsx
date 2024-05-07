"use client";

import { TransactionType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

interface Props {
  type: TransactionType
}

function CategoryPicker({ type }: Props) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () => fetch(`/api/categories?type=${type}`)
      .then((res) => res.json()),
  })
  return (
    <div>CategoryPicker</div>
  )
}

export default CategoryPicker