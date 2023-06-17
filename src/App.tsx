import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");

  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [foundseparations, setFoundseparations] = useState<string[]>([]);
  const [relations, setRelations] = useState([
    ["Sameer", "Aayushi"],
    ["Aayushi", "Bhaskar"],
    ["Sameer", "Kamalnath Sharma"],
    ["Kamalnath Sharma", "Shanti Kumar Saha"],
    ["Shanti Kumar Saha", "Bhaskar"],
  ]);
  useEffect(()=>{
    let relationsInfo = localStorage.getItem("relationsInfo")
    if(relationsInfo){
      setRelations(JSON.parse(relationsInfo))
    }
  }, [])
  const addRelation = () => {
    if (first.length === 0 || second.length === 0) {
      alert("Please fill values before adding.");
      return;
    }
    setRelations([...relations, [first, second]]);
    localStorage.setItem("relationsInfo", JSON.stringify([...relations, [first,second]]));
  }
  const deleteRelation = (idx: number)=>{
    let newRelation = relations.filter((relation, i)=>{
      return idx !== i
    })
    setRelations(newRelation);
    localStorage.setItem("relationsInfo", JSON.stringify(newRelation));
  }
  const findDegreeOfseparation = () => {
    // create adjacency list
    let adj_list: {
      [key: string]: Set<string>;
    } = {};
    for (let i = 0; i < relations.length; i++) {
      let relation = relations[i];
      if (adj_list[relation[0]] === undefined) {
        adj_list[relation[0]] = new Set();
      }
      adj_list[relation[0]].add(relation[1]);

      // if (adj_list[relation[1]] === undefined) {
      //   adj_list[relation[1]] = new Set();
      // }
      // adj_list[relation[1]].add(relation[0]);
    }

    let queue: string[] = [];
    let visited: { [key: string]: boolean } = {};
    queue.push(one);
    let parent: { [key: string]: string | null } = {};
    parent[one] = null;
    visited[one] = true;
    let result: string[] = [];
    while (queue.length > 0) {
      let ele: string = queue.shift() as string;
      if (ele === two) {
        break;
      }
      if (adj_list[ele] !== undefined && adj_list[ele].size > 0)
        for (const neighbour of Array.from(adj_list[ele])) {
          if (neighbour === two) {
            let element: string | null = ele;
            let ans: string[] = [two];
            while (element !== null) {
              ans.unshift(element);
              element = parent[element];
            }
            result.push(ans.join(" ➡ "));
            continue;
          }
          if (visited[neighbour] === undefined) {
            queue.push(neighbour);
            visited[neighbour] = true;
            parent[neighbour] = ele;
          }
        }
    }
    console.log("sdfd", result);
    setFoundseparations(result);
  };


  return (
    <div className="m-10 flex flex-col items-center">
      <div className="text-3xl text-center m-5 font-bold">Find Degree of <span className="italic">separations</span></div>
      <div className="m-2 flex flex-col gap-2">
        <input
          placeholder="Enter First Name"
          className="text-lg border-[1px] border-teal-300 rounded-lg px-2 focus:outline-none focus:ring-0 w-[400px]"
          type="text"
          value={one}
          onChange={(e) => setOne(e.target.value)}
        />
        <input
          placeholder="Enter Second Name"
          className="text-lg border-[1px] border-teal-300 rounded-lg px-2 focus:outline-none focus:ring-0 w-[400px]"
          type="text"
          value={two}
          onChange={(e) => setTwo(e.target.value)}
        />
        <button
          className="text-lg bg-teal-300 text-gray-700 border border-black rounded px-2 w-[400px] hover:bg-teal-200"
          onClick={findDegreeOfseparation}
        >
          Find Degree of Sep.
        </button>
        <div className="text-teal-400 text-xl font-bold">
          Found Degree of separations are:{" "}
        </div>
        {foundseparations.length === 0 && (
          <div className="text-lg text-center">No separations Found</div>
        )}
        <div className="text-lg flex flex-col gap-3">
          {foundseparations.map((sep, idx) => {
            return (
              <div key={idx} className="text-lg text-center">
                {sep}
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-3xl text-center m-5 font-bold">Relations</div>

      <div className="flex flex-col gap-3 justify-center w-fit">
        {relations.map((relation, idx) => {
          return (
            <div className="flex flex-row gap-3" key={idx}>
              <button className="text-lg bg-teal-300 text-gray-700 border border-black rounded px-1 hover:bg-teal-200" onClick={()=>deleteRelation(idx)} title="Delete Relation">Delete</button>
              <div className="text-lg font-bold">{relation[0]}</div>
              <div className="text-lg italic">{` is a friend of `}</div>
              <div className="text-lg font-bold">{relation[1]}</div>
            </div>
          );
        })}
        <div className="flex flex-row gap-3 w-fit">
          <input
            type="text"
            value={first}
            placeholder="Enter Name"
            className="text-lg border-[1px] border-teal-300 rounded-lg px-2 focus:outline-none focus:ring-0 w-[130px]"
            onChange={(e) => setFirst(e.target.value)}
          />
          <div className="text-lg italic">{` is a friend of `}</div>
          <input
            placeholder="Enter Name"
            className="text-lg border-[1px] border-teal-300 rounded-lg px-2 focus:outline-none focus:ring-0 w-[130px]"
            type="text"
            value={second}
            onChange={(e) => setSecond(e.target.value)}
          />
          <button
            className="text-lg bg-teal-300 text-gray-700 border border-black rounded px-2 hover:bg-teal-200"
            onClick={addRelation}
          >
            Add New Relation
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
