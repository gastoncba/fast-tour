import nodemailer from "nodemailer";

import { config } from "../config/config";
import { Order } from "../entities";

type state = "Pendiente" | "Confirmada" | "Pagada" | "Completada" | "Cancelada";
type next = "Confirmada" | "Pagada" | "Completada";

export class EmailService {
  constructor() {}

  async sendEmail(destinationEmail: string, subject?: string, html?: string) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

    await transporter.sendMail({
      from: config.smtpUser,
      to: destinationEmail,
      subject,
      html,
    });

    return { message: "mail sent" };
  }

  async notifyChangeOfStatus(order: Order, title: string, description: string, state: state, nextState?: next): Promise<void> {
    let content = `
    <div style="font-family: 'Arial', sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #009688;">${description}</h2>
      <p>Tu pedido se encuentra actualmente en estado <strong>${state}</strong>.</p>
      <h3>Detalles del Viaje:</h3>
      <p><strong>Viaje:</strong> ${order.trip.name}</p>
      <p><strong>Descripción:</strong> ${order.trip.description}</p>
      <p><strong>Fecha:</strong> ${order.trip.startDate} - ${order.trip.endDate}</p>
      <h3>Lugares y Hoteles:</h3>
      <ul style="list-style-type: none; padding: 0;">`;

    for (const pv of order.placesVisited) {
      content += `
        <li style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
          <h4 style="margin: 0;">Destino: ${pv.place.name}</h4>
          <p style="margin: 5px 0 0;">Hotel: ${pv.hotel.name}</p>
        </li>`;
    }

    content += `
      </ul>
      <p><strong>Total:</strong> ${order.total} USD</p>
      ${nextState ? `<p>¡Te notificaremos cuando la orden sea <strong>${nextState}!</strong></p>` : ""}
    </div>`;
    const destinationEmail = order.email ? order.email : order.user.email;
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.sendEmail(destinationEmail, title, content);
        resolve();
      } catch (error) {
        resolve();
      }
    });
  }
  async sendToUser(message: string, firstName: string, lastName: string, email: string) {
    let content = `<div style="font-family: 'Arial', sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #4285f4;">¡Hola, ${firstName} ${lastName}!</h2>
      <div>${message}</div>
      <h4 style="margin: 5px auto;">Saludos y que tengas un excelente día</h4>
      <p style="font-style: italic;">Enviado desde equipo técnico de Fast-Tour</p>
      </div>`;
    this.sendEmail(email, "Equipo de Fast-Tour", content);
  }
}
