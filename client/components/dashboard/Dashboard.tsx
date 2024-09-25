import useDashboard from '@/hooks/use-dashboard'
import { Column } from './Column'

const Dashboard = () => {
  const { moveTask, tasks } = useDashboard();
  return (
    <div className="container mx-auto mt-14 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Column status="TODO" tasks={tasks} moveTask={moveTask} />
        <Column status="IN_PROGRESS" tasks={tasks} moveTask={moveTask} />
        <Column status="COMPLETED" tasks={tasks} moveTask={moveTask} />
      </div>
    </div>
  )
}

export default Dashboard