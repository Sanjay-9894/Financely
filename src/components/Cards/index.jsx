import React from 'react'
import './styles.css'
import {Row,Card} from "antd";
import Button from "../Button"

const Cards = ({income,expense,currentBalance,showExpenseModel,showIncomeModel}) => {
  return (
    <div>
      <Row className ="my-row">
        <Card bordered={true} className ="my-card" title = "Current Balance">
            <p>₹{currentBalance}</p>  
            <Button blue={true} text ="Reset Balance"/>  
        </Card> 

        <Card bordered={true}  className ="my-card" title = "Total Income">
            <p>₹{income}</p>  
            <Button blue={true} text ="Add Income" onClick={showIncomeModel}/>  
        </Card> 
        
        <Card bordered={true} className ="my-card" title = "Total Expenses">
            <p>₹{expense}</p>  
            <Button blue={true} text ="Add Expenses" onClick={showExpenseModel}/>  
        </Card> 
      </Row>
    </div>
  )
}

export default Cards
