// TODO: write code here
import { CreateTicket } from "../components/create-ticket/create-ticket";
import { TicketList } from "../components/ticket-list/ticket-list";

document.addEventListener("DOMContentLoaded", () => {
  const tickets = new TicketList(".wrapper");
  tickets.createTicketList();
  const popupElement = new CreateTicket(".wrapper", tickets);
});
