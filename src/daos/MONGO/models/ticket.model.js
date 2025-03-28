import mongoose from 'mongoose';
import { nanoid } from 'nanoid';  

const { Schema } = mongoose;


const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,  
    default: () => nanoid(),  
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,  
  },
  amount: {
    type: Number,
    required: true,  
  },
  purchaser: {
    type: String,
    required: true, 
  },
});


/* const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;

import Ticket from './models/Ticket.js';  // Importamos el modelo Ticket

// Función para crear un nuevo ticket
const createTicket = async (amount, purchaserEmail) => {
  try {
    const newTicket = new Ticket({
      amount: amount,
      purchaser: purchaserEmail,
    });

    await newTicket.save();
    console.log("Ticket creado:", newTicket);
  } catch (error) {
    console.error("Error al crear el ticket:", error);
  }
};

// Ejemplo de uso
createTicket(100, 'user@example.com');
 */