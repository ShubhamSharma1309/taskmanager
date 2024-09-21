import useDashboard from '@/hooks/use-dashboard'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { Column } from './Column'
import { isMobile } from 'react-device-detect'

const Dashboard = () => {
  const { moveTask, tasks } = useDashboard();
  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="container mx-auto mt-14 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Column status="TODO" tasks={tasks} moveTask={moveTask} />
          <Column status="IN_PROGRESS" tasks={tasks} moveTask={moveTask} />
          <Column status="COMPLETED" tasks={tasks} moveTask={moveTask} />
        </div>
      </div>
    </DndProvider>
  )
}

export default Dashboard