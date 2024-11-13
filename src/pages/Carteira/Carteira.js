import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConnection"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Carteira.css";

function Carteira() {
  const [saldo, setSaldo] = useState(0); // Estado para o saldo
  const [valor, setValor] = useState(0); // Valor a ser adicionado ou resgatado
  const [uid, setUid] = useState(null);  // Armazenar o UID do usuário

  const navigate = useNavigate();

  // Função que verifica o estado de autenticação e pega o UID
  useEffect(() => {
    onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUid(usuario.uid);
        carregarSaldo(usuario.uid);  // Carregar o saldo do usuário quando logado
      } else {
        navigate("/login"); // Caso o usuário não esteja logado, redireciona para o login
      }
    });
  }, []);

  // Função que carrega o saldo do Firebase para o usuário
  async function carregarSaldo(userUid) {
    const saldoRef = doc(db, "carteiras", userUid); // Usando o UID do usuário para buscar o saldo
    const docSnapshot = await getDoc(saldoRef);

    if (docSnapshot.exists()) {
      setSaldo(docSnapshot.data().saldo); // Atualiza o estado com o saldo do Firebase
    } else {
      setSaldo(0); // Se o saldo não existir, inicializa como 0
    }
  }

  // Função que adiciona saldo
  async function adicionarSaldo() {
    if (valor <= 0) {
      toast.error("O valor para adicionar deve ser maior que zero!");
      return;
    }

    const novoSaldo = saldo + valor;
    const saldoRef = doc(db, "carteiras", uid);
    await setDoc(saldoRef, { saldo: novoSaldo }, { merge: true }); // Atualiza ou cria o saldo no Firebase

    setSaldo(novoSaldo); // Atualiza o estado local
    toast.success(`Saldo adicionado com sucesso! Novo saldo: R$${novoSaldo}`);
    setValor(0); // Limpa o campo de valor
  }

  // Função que resgata saldo
  async function resgatarSaldo() {
    if (valor <= 0) {
      toast.error("O valor para resgatar deve ser maior que zero!");
      return;
    }

    if (valor > saldo) {
      toast.error("Você não tem saldo suficiente para resgatar.");
      return;
    }

    const novoSaldo = saldo - valor;
    const saldoRef = doc(db, "carteiras", uid);
    await setDoc(saldoRef, { saldo: novoSaldo }, { merge: true }); // Atualiza o saldo no Firebase

    setSaldo(novoSaldo); // Atualiza o estado local
    toast.success(`Saldo resgatado com sucesso! Novo saldo: R$${novoSaldo}`);
    setValor(0); // Limpa o campo de valor
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Carteira</h2>
        <p>Saldo Atual: R${saldo}</p>

        <label>Valor</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(parseFloat(e.target.value))}
          placeholder="Digite o valor"
        />

        <div className="buttons">
          <button onClick={adicionarSaldo}>Adicionar Saldo</button>
          <button onClick={resgatarSaldo}>Resgatar Saldo</button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Carteira;
