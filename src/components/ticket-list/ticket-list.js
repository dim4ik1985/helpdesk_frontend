import "./ticket-list.css";
export class TicketList {
  constructor(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    this._element = element;
    this._tickets = undefined;
    this._descriptionItemClick = undefined;
    this._ticketList = undefined;

    this.createTicketList = this.createTicketList.bind(this);
    this.showTicketList = this.showTicketList.bind(this);
    this.addNewTicket = this.addNewTicket.bind(this);
    this.descriptionTicket = this.descriptionTicket.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
    this.statusTicket = this.statusTicket.bind(this);
    this.editTicket = this.editTicket.bind(this);
  }

  createTicketList() {
    this._tickets = document.createElement("div");
    this._tickets.className = "tickets";
    this._element.append(this._tickets);

    this.showTicketList();
  }

  showTicketList() {
    const url = "http://localhost:7070?method=allTickets";
    (async () => {
      const response = await fetch(url);

      if (response.ok) {
        const json = await response.json();
        if (json.length === 0) {
          return;
        }
        json.forEach((item) => {
          this.addNewTicket(item.id, item.status, item.name, item.created);
        });
      } else {
        console.log("Error: " + response.status);
      }
    })();
  }

  addNewTicket(id, status, name, created) {
    this._tickets.insertAdjacentHTML(
      "beforeend",
      `<div class="ticket">
              <div class="container">
                <div class="ticket-wrap">
                  <ul class="ticket-item">
                    <li class="item-id" data-id="${id}"></li>
                    <li class="item-status">
                       <a href="#" class="btn status" data-status="${status}" data-action="status"></a>
                    </li>
                    <li class="item-el name" data-action="description">${name}</li>
                    <li class="item-el created">${created}</li>
                    <li class="item-el">
                      <a href="#" class="btn edit" data-action="createEditPopup"></a>
                    </li>
                    <li class="item-el">
                      <a href="#" class="btn delete" data-action="createDeleteTicket"></a>
                    </li>
                  </ul>
                </div>
                <div class="ticket-description"></div>
              </div>
            </div>`
    );
  }

  statusTicket(elem) {
    const parent = elem.closest(".ticket");
    const id = parent.querySelector(".item-id").dataset.id;
    const url = `http://localhost:7070?method=statusById&id=${id}`;
    let currentStatus = parent.querySelector(".btn.status");
    const checkStatus =
      currentStatus.dataset.status === "false" ? "true" : "false";
    console.log(currentStatus);

    (async () => {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: checkStatus,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        currentStatus.dataset.status = json.status;
      } else {
        console.log("Error: " + response.status);
      }
    })();
  }

  editTicket(elem) {
    const parent = elem.closest(".ticket");
    const id = parent.querySelector(".item-id").dataset.id;
    const url = `http://localhost:7070?method=editTicket&id=${id}`;
  }
  descriptionTicket(elem) {
    const parent = elem.closest(".ticket");
    const id = parent.querySelector(".item-id").dataset.id;
    const url = `http://localhost:7070?method=ticketById&id=${id}`;

    this._descriptionItemClick = parent.querySelector(".ticket-description");

    (async () => {
      const response = await fetch(url);

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        if (this._descriptionItemClick.classList.contains("open")) {
          this._descriptionItemClick.textContent = "";
          this._descriptionItemClick.classList.remove("open");
          return;
        }

        this._descriptionItemClick.classList.add("open");
        this._descriptionItemClick.textContent = `${json.description}`;
      } else {
        console.log("Error: " + response.status);
      }
    })();
  }

  deleteTicket(item) {
    const id = item.querySelector(".item-id").dataset.id;

    const url = `http://localhost:7070?method=deleteById&id=${id}`;

    (async () => {
      const response = await fetch(url, {
        method: "DELETE",
      });

      item.closest(".ticket").remove();
    })();
  }
}
