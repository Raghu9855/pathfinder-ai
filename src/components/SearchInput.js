import React,{useState} from "react";

function SearchInput({onSearch}) {
  const [topic, setTopic] = useState('');
  const [week, setWeek] = useState('');
  const handleSubmit=(e)=>{
    e.preventDefault();
    onSearch(topic, week);
  }
  console.log(topic, week);
  return (
    <form className="search-form" onSubmit={handleSubmit}>
        <input className="topic-input" onChange={(e) => setTopic(e.target.value)} type="text" placeholder="Search..." value={topic} />
        <input className="week-input" onChange={(e) => setWeek(e.target.value)} type="number" placeholder="Weeks..." min={1} max={52} value={week} />
        <button>Map</button>
        
    </form>
  );
}

export default SearchInput;
