
import './App.css';
import SearchInput from './SearchInput';
import RoadmapDisplay from './RoadmapDisplay';
import React,{useState} from 'react';


function App() {
  
  const[isLoading,setisLoading]=useState(false);
  const[roadmap,setroadmap]=useState(null);
  const handleSearch=(topic)=>{
      setisLoading(true);
      setroadmap(null);
      const timeout = setTimeout(() => {
        const mockData = {
        title: 'Learn Guitar',
    weeks: [
      { week: 1, topic: 'The Basics: Anatomy of the Guitar & Basic Chords' },
      { week: 2, topic: 'Strumming Patterns & Transitions' },
      { week: 3, topic: 'Learning Your First Song' }
    ]
    };
        setroadmap(mockData);
        setisLoading(false);
        clearTimeout(timeout);
      }, 2000);
    }

  return (
    <div className="app-container">
      <h1>PathFinder AI</h1>
      <SearchInput onSearch={handleSearch} />
      <div>
        {(isLoading)?<p>Generating Path.....</p>:(roadmap)?<RoadmapDisplay roadmap={roadmap} />:null}
      </div>
    </div>
  );
}



export default App;
