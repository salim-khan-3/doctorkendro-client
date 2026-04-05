'use client'

import React from 'react'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface DoctorProps {
  id: string
  name: string
  specialty: string
  experience: string
  rating: string
  fee: string
}

const DoctorCard = ({ id, name, specialty, experience, rating, fee }: DoctorProps) => {
  return (
    <Link href={`/doctors/${id}`}>
      <div className="bg-gradient-to-r from-[#005a78] to-[#4fa3b3] rounded-lg p-4 flex items-center justify-between text-white shadow-md hover:scale-[1.02] transition-transform cursor-pointer min-w-[300px] flex-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center">
            <span className="text-2xl font-bold">{name.charAt(4)}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm md:text-base leading-tight">{name}</h3>
            <p className="text-xs opacity-90">{specialty}</p>
            <p className="text-[10px] opacity-80">{experience} experience</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-bold">{rating}</span>
            </div>
          </div>
        </div>
        <div className="text-right self-end">
          <span className="text-[10px] opacity-80 block">BDT</span>
          <span className="font-bold text-sm">{fee}</span>
        </div>
      </div>
    </Link>
  )
}

const DoctorSection = () => {
  const doctors = [
    { id: '1', name: 'Dr. Marian Khalid', specialty: 'Gynecologist', experience: '10 years', rating: '4.9/5', fee: '1,000' },
    { id: '2', name: 'Dr. Rabia Imran', specialty: 'Dermatologist', experience: '8 years', rating: '4.9/5', fee: '2,000' },
    { id: '3', name: 'Dr. Sameera Naveed', specialty: 'Psychiatrist', experience: '15 years', rating: '4.9/5', fee: '3,000' },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[#eef8fb] rounded-xl p-6">
        <h2 className="text-[#005a78] font-bold mb-4 text-xl">Doctors in Dhaka</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          {doctors.map((doc, index) => (
            <DoctorCard key={index} {...doc} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default DoctorSection