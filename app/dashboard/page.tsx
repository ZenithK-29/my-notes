"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { CalendarDemo } from '@/components/CalenderModule'
import { useState } from 'react'
import { NotesClient } from '../page'
import { useRouter } from 'next/navigation'
import { DateRange, DayPicker } from 'react-day-picker'
import "react-day-picker/dist/style.css"

const Dashboard = () => {

  const { data: session } = useSession()
  const [selectedDate, setselectedDate] = useState<Date | null>(null)
  const [notes, setnotes] = useState<NotesClient[]>([])
  const [priority, setpriority] = useState("")
  const [range, setrange] = useState<DateRange | undefined>()
  const router = useRouter()

  

  useEffect(() => {

    if(!session){
    router.push("/login")
  }

    if (!selectedDate || !session?.user?.id) return

    const fetchNotes = async () => {

      const res = await fetch(`/api/dashboard/?date=${selectedDate.toLocaleDateString("en-CA")}&id=${session.user.id}`)

      const data = await res.json()

      setnotes(data.content)

      console.log("Seleted: ", selectedDate.toLocaleDateString("en-CA"))
      console.log("Response data: ", data.content)
    }

    fetchNotes()
  }, [selectedDate, router])




  const handleDateClick = async (date: Date | undefined) => {
    if (!date) return
    setselectedDate(date)
  }

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setpriority(e.target.value)
  }

  const handleRangedForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!range?.from || !range?.to) return

    const startDate = range?.from?.toLocaleDateString("en-CA")
    const endDate = range?.to?.toLocaleDateString("en-CA")

    const res = await fetch(`/api/notes/filter?startDate=${startDate}&endDate=${endDate}`)

    const data = await res.json()


    setnotes(data.content)
    console.log("Ranged notes: ", data.content)
  }
  


  return (
    <div className='bg-amber-100 min-h-screen'>
      <Navbar />
      <div className='bg-amber-200 w-3/4 min-h-screen mx-auto flex flex-col justify-center items-center'>
        <h1 className='font-bold text-4xl text-amber-700'>Welcome {session?.user?.email?.split("@")[0]}</h1>


        <div className='flex gap-4 items-center justify-center'>
          <p className='my-2 font-bold text-2xl'>Your Notes: </p>
          <input type="radio" name="priority" id="bydate" value="low" checked={priority === "low"} onChange={handleRadio} />
          <p className='font-medium'>By Date</p>

          <input type="radio" name="priority" id="byrange" value="medium" checked={priority === "medium"} onChange={handleRadio} />
          <p className='font-medium'>By range</p>
        </div>

        {priority === "low" && (

          <div className='my-2'>

            <CalendarDemo
              selected={selectedDate ?? undefined}
              onSelect={handleDateClick}
            />
          </div>
        )}

        {priority === "medium" && (

          <div className='rangeditem mb-2'>

            <div className='w-fit m-auto'>
              <DayPicker
                mode='range'
                selected={range}
                onSelect={setrange}
                className='bg-white rounded-md p-2'
              />

            </div>

            <div>
              
            <form onSubmit={handleRangedForm} className='flex gap-4 py-2'>
              <input type="date" name="from" value={range?.from ? range.from.toLocaleDateString("en-CA") : ""} className='bg-white' readOnly/>
              <input type="date" name="to" value={range?.to ? range.to.toLocaleDateString("en-CA") : ""} className='bg-white' readOnly/>
              <button className='bg-blue-400 p-2 text-white rounded-2xl cursor-pointer'>Sumbit</button>
            </form>
            </div>
          </div>
        )}

        <div className="cardContainer flex gap-4">
          {notes.length === 0 ? (
            <p>No notes to display</p>
          ) : (notes.map((item) => (

            <div key={item._id} className="card bg-amber-100 h-50 w-50 rounded-2xl flex flex-col shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <h1 className='bg-amber-600 rounded-t-2xl font-semibold h-9 flex items-center justify-center uppercase'>{item.title}</h1>
              <p className='p-2 flex-1 overflow-y-auto custom-scroll flex items-center justify-center'>{item.description}</p>

            </div>
          )))}
        </div>


      </div>


    </div>
  )
}

export default Dashboard