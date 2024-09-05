import React,{useState} from "react";
import { Link } from "react-router-dom";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../../firebaseConnection";

function Cadastro(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [
      createUserWithEmailAndPassword,
      user,
      loading,
      error,
    ] = useCreateUserWithEmailAndPassword(auth);

    function singUp(e){
        e.preventDefault();
        createUserWithEmailAndPassword(email,password)
    }
    return(
        <div>
            <label>Usuario</label>
            <input type="text" placeholder="usuario" onChange={e =>setEmail(e.target.value)}></input>
            <label>Senha</label>
            <input type="text" placeholder="senha" onChange={e =>setPassword(e.target.value)}></input>
            <button onClick={singUp}>Cadastrar</button>
            <Link to="/">Já Possui Conta</Link>
        </div>
    )
}

export default Cadastro