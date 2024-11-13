import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConnection";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import "./SlotMachine.css";

function SlotMachine() {
  const [reels, setReels] = useState([0, 0, 0]);
  const [betAmount, setBetAmount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchUserBalance(user.uid);  // Carregar o saldo do Firebase
    }
  }, []);

  // Função para buscar o saldo do usuário no Firebase
  const fetchUserBalance = async (uid) => {
    try {
      const userRef = doc(db, "carteiras", uid); // Usando a coleção de carteiras
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        setUserBalance(userDoc.data().saldo); // Atualiza o saldo no estado
      } else {
        console.log("Usuário não encontrado!");
      }
    } catch (error) {
      console.log("Erro ao ler o saldo do usuário:", error);
    }
  };

  // Função para girar os rolos
  const spinReels = async () => {
    if (isSpinning) return;

    // Verifica se a aposta é válida e se o usuário tem saldo suficiente
    if (betAmount <= 0 || betAmount > userBalance) {
      alert("Por favor, insira um valor de aposta válido!");
      return;
    }

    setIsSpinning(true);

    // Gerar números aleatórios para os rolos (0-9)
    const newReels = Array(3)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10));

    setReels([0, 0, 0]); // Resetando os rolos para animação
    setTimeout(() => {
      setReels(newReels); // Atualizando os rolos após a animação
      checkResult(newReels); // Verifica o resultado do giro
    }, 1000);
  };

  // Função para verificar o resultado
  const checkResult = async (newReels) => {
    let resultMessage = "Você perdeu a aposta!";
    let resultMultiplier = 0;

    if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      // 3 números iguais -> ganhar 100% do valor
      resultMessage = "Você ganhou 100% do valor apostado!";
      resultMultiplier = 2; // 100% do valor
    } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
      // 2 números iguais -> ganhar 50% do valor
      resultMessage = "Você ganhou 50% do valor apostado!";
      resultMultiplier = 1.5; // 50% do valor
    } else {
      // 3 números diferentes -> perder o valor apostado
      resultMessage = "Você perdeu o valor apostado!";
      resultMultiplier = 0;
    }

    // Atualizar o saldo do usuário no Firebase
    await updateUserBalance(resultMultiplier);

    alert(resultMessage);
    setIsSpinning(false);
  };

  // Função para atualizar o saldo do usuário
  const updateUserBalance = async (multiplier) => {
    try {
      const userRef = doc(db, "carteiras", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentBalance = userDoc.data().saldo;
        const newBalance = currentBalance + betAmount * multiplier - betAmount;

        await updateDoc(userRef, { saldo: newBalance }); // Atualizando o saldo no Firestore
        setUserBalance(newBalance); // Atualizando o estado local do saldo
      }
    } catch (error) {
      console.log("Erro ao atualizar o saldo do usuário:", error);
    }
  };

  return (
    <div className="slot-machine">
      <h2>Máquina de Slots</h2>
      <div className="reels">
        {reels.map((reel, index) => (
          <div key={index} className="reel">
            <span>{reel}</span>
          </div>
        ))}
      </div>

      <div className="controls">
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(parseFloat(e.target.value))}
          placeholder="Valor da aposta"
        />
        <button onClick={spinReels} disabled={isSpinning}>
          {isSpinning ? "Girando..." : "Girar"}
        </button>
      </div>
      <div className="balance">
        <p>Saldo: R${userBalance}</p>
      </div>
    </div>
  );
}

export default SlotMachine;
