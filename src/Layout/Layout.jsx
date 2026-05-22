import React from 'react'
import TrendingMedicines from '../TrendingMedicines/TrendingMedicines'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
              
      <Outlet/>
    </div>
  )
}
