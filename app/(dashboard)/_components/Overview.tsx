"use client";

import { UserSettings } from '@prisma/client';
import React from 'react'

interface Props {
    userSettings: UserSettings;
}

function Overview({userSettings}: Props) {
  return (
    <div>Overview</div>
  )
}

export default Overview