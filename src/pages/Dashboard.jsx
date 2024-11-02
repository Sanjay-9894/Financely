import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import {Modal} from "antd"
import AddExpense from '../components/Modals/addExpense'
import AddIncome from '../components/Modals/addIncome'
import { addDoc, collection, getDocs, query } from 'firebase/firestore'
import moment from 'moment'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { toast } from 'react-toastify'
import TransactionsTable from '../components/TransactionsTable'

const Dashboard = () => {
  const [isExpenseModalVisible,setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible,setIsIncomeModalVisible] = useState(false);
  const [user] = useAuthState(auth)
  const [transactions,setTransactions] = useState([]);
  const [loading,setLoading] = useState(false);
  const[income,setIncome] = useState(0);
  const[expense,setExpense] =useState(0);
  const[currentBalance,setCurrentBalance] =useState(0);

  const showExpenseModel =() =>{
    setIsExpenseModalVisible(true);

  }

  const handleExpenseCancel=()=>{
    setIsExpenseModalVisible(false);
  }

  const showIncomeModel =() =>{
    setIsIncomeModalVisible(true);

  }

  const handleIncomeCancel=()=>{
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values,type) =>{
    const newTransaction = {
      type: type,
      date:values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name:values.name,
    }
    addTransaction(newTransaction);

  }

  
  useEffect(() => {
    fetchTransactions();

  },[user]);

  useEffect(() => {
    calculateBalance();

  },[transactions]);

  const calculateBalance =() =>{
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) =>{
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      }else{
        expensesTotal += transaction.amount;
      }
    })

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  }

  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction Added")
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();

    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction")
    }
  }

  async function fetchTransactions(){
    setLoading(true);
   
    try{
      if(user){
        const q = query(collection(db,`users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionArray = [];
        querySnapshot.forEach((doc) =>{
          transactionArray.push(doc.data());
        })
        setTransactions(transactionArray);
        toast.success("Transactions Fetched!");
        console.log(transactionArray)
      }else{
        console.log("User not defined");
      }
      
    }catch(e){
      console.error("Error fetching transactions:", e);
      toast.error("Failed to fetch transactions!");
    }finally {
      setLoading(false);
    }
  
  }

  return (
    <div>
      <Header/>
      <Cards 
        income = {income}
        expense = {expense}
        currentBalance = {currentBalance}
        showExpenseModel={showExpenseModel}
        showIncomeModel={showIncomeModel}
       />
      <AddExpense
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish = {onFinish}
      />
      <AddIncome
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionsTable 
        transactions ={transactions} 
        addTransaction={addTransaction}
        fetchTransactions={fetchTransactions}
      />
    </div>
  )
}

export default Dashboard
