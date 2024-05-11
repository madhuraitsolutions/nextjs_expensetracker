import { UserSettings } from '@prisma/client';
import React from 'react'

interface Props {
    userSettings: UserSettings;
}

function History({ userSettings }: Props) {
  return (
    <div>History</div>
  )
}

export default History