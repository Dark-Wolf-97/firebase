import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConnection";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth"; // Alterado para incluir signOut
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import "./Perfil.css"; // Aplique o CSS aqui

function Perfil() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cpf, setCPF] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [Id, setId] = useState(null);
  const [uid, setUid] = useState(null); 

  // Hook para verificar o estado da autenticação do usuário
  useEffect(() => {
    onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setUid(usuario.uid);
        carregarPerfil(usuario.uid);
      } else {
        setUid(null);
        navigate("/login"); // Se não estiver logado, redireciona para a página de login
      }
    });
  }, []);

  // Função para carregar o perfil do usuário do Firebase
  async function carregarPerfil(usarioUid) {
    const perfilQuery = query(collection(db, "perfis"), where("uid", "==", usarioUid));
    const querySnapshot = await getDocs(perfilQuery);

    if (!querySnapshot.empty) {
      const perfilDoc = querySnapshot.docs[0];
      const perfilDados = perfilDoc.data();
      setNome(perfilDados.nome);
      setSobrenome(perfilDados.sobrenome);
      setCPF(perfilDados.cpf);
      setTelefone(perfilDados.telefone);
      setEndereco(perfilDados.endereco);
      setId(perfilDoc.id);
    }
  }

  // Função para adicionar ou atualizar o perfil do usuário
  async function AdicionarOuAtualizarPerfil(e) {
    e.preventDefault();

    const perfilDados = {
      uid,
      nome,
      sobrenome,
      cpf,
      telefone,
      endereco
    };

    if (Id) {
      const perfilRef = doc(db, "perfis", Id);
      await updateDoc(perfilRef, perfilDados);
    } else {
      await addDoc(collection(db, "perfis"), perfilDados);
    }

    toast.success("Perfil salvo com sucesso!");
  }

  // Função para excluir a conta e o perfil do usuário
  async function excluirConta() {
    if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      try {
        if (Id) {
          const perfilRef = doc(db, "perfis", Id);
          await deleteDoc(perfilRef);
        }

        const conta = auth.currentUser;
        await deleteUser(conta);

        toast.success("Conta excluída com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir a conta. Por favor, faça login novamente e tente novamente.");
      }
    }
    navigate("/");
  }

  // Função para fazer logout
  async function logout() {
    try {
      await signOut(auth);
      toast.success("Você foi desconectado com sucesso!");
      navigate("/login"); // Redireciona para o login após o logout
    } catch (error) {
      toast.error("Erro ao fazer logout.");
    }
    navigate("/")
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Perfil</h2>
        <form onSubmit={AdicionarOuAtualizarPerfil}>
          <label>Nome</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Digite seu nome" 
          />
          
          <label>Sobrenome</label>
          <input 
            type="text" 
            value={sobrenome} 
            onChange={(e) => setSobrenome(e.target.value)} 
            placeholder="Digite seu sobrenome" 
          />
          
          <label>CPF</label>
          <input 
            type="text" 
            value={cpf} 
            onChange={(e) => setCPF(e.target.value)} 
            placeholder="Digite seu CPF" 
          />
          
          <label>Telefone</label>
          <input 
            type="text" 
            value={telefone} 
            onChange={(e) => setTelefone(e.target.value)} 
            placeholder="Digite seu telefone" 
          />
          
          <label>Endereço</label>
          <input 
            type="text" 
            value={endereco} 
            onChange={(e) => setEndereco(e.target.value)} 
            placeholder="Digite seu endereço" 
          />
          
          <button type="submit">Salvar perfil</button>
        </form>
        <button 
          onClick={excluirConta} 
          style={{ backgroundColor: "#ff4d4d", color: "#fff", marginTop: "15px" }}
        >
          Excluir Conta
        </button>
        <button 
          onClick={logout} 
          style={{ backgroundColor: "#007bff", color: "#fff", marginTop: "15px" }}
        >
          Logout
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Perfil;
