import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from "axios";

import './App.css';

function App() {
  const [chain, setChain] = useState();
  const [users, setUsers] = useState();
  const [transactions, setTransactions] = useState();
  const [userTotal, setUserTotal] = useState({});
  const [selectedUser, setSelectedUser] = useState("Mark Halls");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/chain")
      .then(res => setChain(res.data.chain))
  }, [])

  useEffect(() => {
    if (chain && chain.length > 0) {
      const newUserTotal = { ...userTotal };
      const newTransactionArr = [];
      const users = chain && chain.reduce((users, block) => {
        block.transactions.forEach((transaction) => {
          newTransactionArr.push(transaction);
          const { sender, recipient, amount } = transaction;
          users.add(sender);
          users.add(recipient);
          newUserTotal[sender] = (newUserTotal[sender] || 0) - amount;
          newUserTotal[recipient] = (newUserTotal[recipient] || 0) + amount;
        })
        return users;
      }, new Set())
      setTransactions(newTransactionArr);
      setUserTotal(newUserTotal);
      setUsers([...users].filter(user => user !== "0"));
    }
  }, [chain, setUsers])

  // useEffect(() => console.log(userTotal), [userTotal])

  const handleChange = (event) => {
    setSelectedUser(event.target.value)
  }
  return (
    <div className="App">
      <select value={selectedUser || users && users[0]} onChange={handleChange}>
        {users && users.map(user => {
          if (selectedUser === user) {
            return <option selected value={user}>{user}</option>
          }
          return <option value={user}>{user}</option>
        })
        }
      </select>
      {selectedUser && <p>{selectedUser} has {userTotal[selectedUser]} coin(s)</p>}
      {transactions && transactions.map(transaction => {
        if (transaction.sender === selectedUser || transaction.recipient === selectedUser) {

          if (transaction.sender === "0") {
            return (
              <p>Awarded {transaction.recipient} {transaction.amount} coin(s)</p>
            )
          }
          return (
            <p>From: {transaction.sender} To: {transaction.recipient} Amount: {transaction.amount}</p>
          )
        }
      })}
    </div>
  );
}

export default App;
