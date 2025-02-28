import './App.css';
import Label from './components/label';
import TextInput from './components/textInput';

function App() {
  return (
    <div className="App">
      <Label text="Username/ID:" size='3' color='#252525'/>
      <TextInput phTxt="Enter Username/ID Here" isPass={false} />
      <Label text="Password:" size='3' />
      <TextInput phTxt="Enter Password Here" isPass={true} />
      <div className="inline-elements">
        <p>Forgot your password? too bad</p>
        <button>Log In</button>
      </div>
    </div>
  );
}

export default App;
