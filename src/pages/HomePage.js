import SearchInput from '../components/SearchInput';
import RoadmapDisplay from '../components/RoadmapDisplay';
import React,{useState} from 'react';


function App() {
  
  const[isLoading,setisLoading]=useState(false);
  const[roadmap,setroadmap]=useState(null);
  const handleSearch=async (topic)=>{
      setisLoading(true);
      setroadmap(null);
      const url='http://localhost:5001/api/roadmap';
      try {
        const response=await fetch(url,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({ topic })
        });
          const Data=await response.json();
          setroadmap(Data.roadmap);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      }finally{
        setisLoading(false);
      }
      
      
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
