import React,{useState} from "react";

function SearchInput({onSearch}) {
  const [topic, setTopic] = useState('');
  const handleSubmit=(e)=>{
    e.preventDefault();
    onSearch(topic);
  }
  console.log(topic);
  return (
    <form onSubmit={handleSubmit}>
        <input onChange={(e) => setTopic(e.target.value)} type="text" placeholder="Search..." value={topic} />
        <button>Map</button>
        
    </form>
  );
}

export default SearchInput;
