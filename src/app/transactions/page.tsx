"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function Transactions() {

  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch transactions 
  const fetchTransactions = async () => {
    const { data } = await supabase.from("transactions").select("*");
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = async () => {
    // Error checking to make sure all fields are filled in
    if (!title || !description || !date || !amount) {
      console.error("All fields must be filled");
      alert("Please fill in all the fields!"); 
      return;
    }

    const { data: newTransaction, error } = await supabase
      .from("transactions")
      .insert([{ title, description, date, amount }])
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      return;
    }

    // Update the transactions state with the new transaction
    fetchTransactions();
    setTitle("");
    setDescription("");
    setDate("");
    setAmount("");
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    await supabase.from("transactions").delete().match({ id });
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const editTransaction = async (id) => {
    const updatedTitle = prompt("Enter new title:");
    const updatedDescription = prompt("Enter new description:");
    const updatedDate = prompt("Enter new date (YYYY-MM-DD):");
    const updatedAmount = prompt("Enter new amount:");
  
    // Validation checks
    if (updatedTitle && typeof updatedTitle !== "string") {
      alert("Title must be a valid string.");
      return;
    }
    if (updatedDescription && typeof updatedDescription !== "string") {
      alert("Description must be a valid string.");
      return;
    }
    if (updatedDate && !/^\d{4}-\d{2}-\d{2}$/.test(updatedDate)) {
      alert("Date must be in the format YYYY-MM-DD.");
      return;
    }
    if (updatedDate && isNaN(new Date(updatedDate).getTime())) {
      alert("Invalid date.");
      return;
    }
    if (updatedAmount && isNaN(parseFloat(updatedAmount))) {
      alert("Amount must be a valid number.");
      return;
    }
  
    if (updatedTitle || updatedDescription || updatedDate || updatedAmount) {
      const updatedFields = {};
      if (updatedTitle) updatedFields.title = updatedTitle;
      if (updatedDescription) updatedFields.description = updatedDescription;
      if (updatedDate) updatedFields.date = updatedDate;
      if (updatedAmount) updatedFields.amount = parseFloat(updatedAmount); 
  
      const { error } = await supabase
        .from("transactions")
        .update(updatedFields)
        .match({ id });
  
      if (error) {
        console.error("Error updating transaction:", error);
        return;
      }
  
      // Refresh the transaction list
      fetchTransactions();
    }
  };

  // Function to calculate total amount
  const calculateTotalAmount = (transactions) => {
    return transactions.reduce((total, transaction) => {
      return total + (transaction?.amount ? parseFloat(transaction.amount) : 0);
    }, 0);
  };

  const totalAmount = calculateTotalAmount(transactions);

  const backHome = ()=>{
    router.push("/")
  }


  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={backHome}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Home
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder="Amount in Euros"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={addTransaction}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Transaction
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Total Amount: €{totalAmount.toFixed(2)}
      </h2>
    

      <table className="table-auto w-full text-left text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Amount (€)</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id} className="border-b">
            <td className="px-4 py-2">{transaction.title}</td>
            <td className="px-4 py-2">{transaction.description}</td>
            <td className="px-4 py-2">{transaction.date}</td>
            <td className={`px-4 py-2 ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {transaction.amount} €
            </td>
            <td className="px-4 py-2">
              <button
                onClick={() => editTransaction(transaction.id)}
                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  );
}