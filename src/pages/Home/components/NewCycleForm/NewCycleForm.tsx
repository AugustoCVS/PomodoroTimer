import { FormContainer, MinutesAmountInput, TaskInput } from './style'
import { useContext } from 'react'
import { CyclesContext } from '../../../../Context/CyclesContext'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="taskSuggestions"
        disabled={!!activeCycle}
        placeholder="De um nome para o seu projeto"
        {...register('task')}
      />

      <datalist id="taskSuggestions">
        <option value="Proketo 1" />
        <option value="Proketo 2" />
        <option value="Proketo 3" />
      </datalist>

      <label htmlFor="minutesAmount">Durante</label>
      <MinutesAmountInput
        type="number"
        id="minuteAmount"
        placeholder="00"
        step={0}
        min={1}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
