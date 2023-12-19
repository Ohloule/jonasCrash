import { useState, useEffect } from "react";
import supabase from "./supabase";
import "./style.css";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function getFacts() {
      setIsLoading(true);
      let { data: facts, error } = await supabase
        .from("facts")
        .select("*")
        .order("votesInteresting", { ascending: false })
        .limit(1000);

      if (!error) {
        setFacts(facts);
      } else {
        alert("An error occured while fetching facts");
        console.log(error);
        setIsLoading(false);
      }

      setIsLoading(false);
    }
    getFacts();
  }, []);

  return (
    <>
      <Header setShowForm={setShowForm} showForm={showForm} />

      {showForm ? (
        <NewFactForm setShowForm={setShowForm} setFacts={setFacts} />
      ) : null}

      <main className="main">
        <CategoryFilter setFacts={setFacts} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Today I Learned";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I Learned Logo" />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large"
        id="newFact"
        onClick={() => {
          setShowForm(!showForm);
        }}
      >
        {!showForm ? "Share a fact" : "Close"}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setShowForm, setFacts }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("https://example.com");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChangeText = (event) => {
    if (text.length < 200) {
      setText(event.target.value);
    }
  };

  async function handleSubmit(event) {
    // Empécher le Navigateur de recharger la page
    event.preventDefault();

    //Vériier que le texte n'est pas vide
    if (text && category && text.length <= 200 && isValidHttpUrl(source)) {
      //Créer un nouvel objet fact
      /*       const newFact = {
        id: Math.round(Math.random() * 1000000, 0),
        text: text,
        source: source,
        category: category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      }; */

      //Ajouter le nouvel objet fact dans la liste des facts: Ajouter le nouveau fait dans le state
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();

      setIsUploading(false);

      setFacts((facts) => [newFact[0], ...facts]);

      //Réinitialiser le formulaire
      setText("");
      setSource("https://example.com");
      setCategory("");

      //Fermer le formulaire
      setShowForm(false);
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        disabled={isUploading}
        maxLength={200}
        onChange={handleChangeText}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        disabled={isUploading}
        onChange={(event) => {
          setSource(event.target.value);
        }}
      />
      <select
        value={category}
        disabled={isUploading}
        onChange={(event) => {
          setCategory(event.target.value);
        }}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
          </option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter({ setFacts }) {
  function handleFilter(v) {
    if (v === "*") {
      async function getFacts() {
        let { data: facts, error } = await supabase
          .from("facts")
          .select("*")
          .order("votesInteresting", { ascending: false })
          .limit(1000);

        if (!error) {
          setFacts(facts);
        } else {
          alert("An error occured while fetching facts");
          console.log(error);
        }
      }
      getFacts();
    } else {
      async function getFacts() {
        let { data: facts, error } = await supabase
          .from("facts")
          .select("*")
          .eq("category", v)
          .order("votesInteresting", { ascending: false })
          .limit(1000);

        if (!error) {
          setFacts(facts);
        } else {
          alert("An error occured while fetching facts");
          console.log(error);
        }
      }
      getFacts();
    }
  }
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => handleFilter("*")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li className="category" key={cat.name}>
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => handleFilter(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own ! </p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVotes(columnName) {
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔️ DISPUTED]</span> : null}
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (category) => category.name === fact.category
          ).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          disabled={isUpdating}
          onClick={() => handleVotes("votesInteresting")}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          disabled={isUpdating}
          onClick={() => handleVotes("votesMindblowing")}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button disabled={isUpdating} onClick={() => handleVotes("votesFalse")}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
