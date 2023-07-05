import { HandPalm, Play } from 'phosphor-react'
import * as zod from 'zod'

import {
  HomeContainer,
  StartCounDownButton,
  StopCounDownButton,
} from './styles'
import { Cycle } from '../../interfaces/Cycle'
import { NewCycleForm } from './components/NewCycleForm/NewCycleForm'
import { CountDown } from './components/CountDown/CountDown'
import { CyclesContext } from '../../Context/CyclesContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O clico precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclor precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setamountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state: any) =>
      state.map((cycle: any) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state: any) => [...state, newCycle]) // ([...cycles, newCycle])
    setActiveCycleId(id)
    setamountSecondsPassed(0)

    reset()
  }

  function handleInterrputCycle() {
    setCycles((state: any) =>
      state.map((cycle: any) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCounDownButton onClick={handleInterrputCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCounDownButton>
        ) : (
          <StartCounDownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCounDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
