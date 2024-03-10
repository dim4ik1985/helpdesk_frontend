import "./create-ticket.css";

export class CreateTicket {
  constructor(element, ticketItem) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    this._element = element;
    this._ticketItem = ticketItem;

    this._popup = undefined;
    this._clicker = this._element;
    this._formElements = undefined;
    this._ticketId = undefined;

    this.closePopup = this.closePopup.bind(this);
    this.addTicket = this.addTicket.bind(this);
    this.createPopupTicket = this.createPopupTicket.bind(this);
    this.actionTickets = this.actionTickets.bind(this);
    this.description = this.description.bind(this);
    this.createDeleteTicket = this.createDeleteTicket.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
    this.status = this.status.bind(this);
    this.createEditPopup = this.createEditPopup.bind(this);

    this._clicker.addEventListener("click", this.actionTickets);
  }

  actionTickets(e) {
    const activeElem = e.target;
    const action = e.target.dataset.action;
    if (action) {
      this[action](activeElem);
    }
  }

  status(elem) {
    this._ticketItem.statusTicket(elem);
  }

  description(elem) {
    this._ticketItem.descriptionTicket(elem);
  }

  deleteTicket() {
    this._ticketItem.deleteTicket(this._ticketId);
    this.closePopup();
  }

  createPopupTicket() {
    const popupElement = document.createElement("div");
    popupElement.className = "create_ticket";

    this._element.append(popupElement);

    popupElement.insertAdjacentHTML(
      "afterbegin",
      ' <div class="create_ticket-container">\n' +
        '      <div class="create_ticket-wrapper">\n' +
        '        <p class="create_ticket-title">Добавить тикет</p>\n' +
        '        <form class="ticket-form">\n' +
        '          <p class="ticket__name-title">Краткое описание</p>\n' +
        '          <input type="text" class="ticket__name" name="name" required>\n' +
        '          <p class="ticket__description-title">Подробное описание</p>\n' +
        '          <textarea class="ticket__description" name="description" rows="4" maxlength="300"></textarea>\n' +
        '          <div class="ticket__buttons">\n' +
        '            <button class="ticket__btn-cancel" data-action="closePopup">Отмена</button>\n' +
        '            <button class="ticket__btn-ok">Ok</button>\n' +
        "          </div>\n" +
        "        </form>\n" +
        "      </div>\n" +
        "    </div>"
    );

    this._popup = popupElement;

    this._formElements = this._popup.querySelector(".ticket-form");
    this.addTicket();
  }

  createEditPopup(elem) {
    const parent = elem.closest(".ticket");
    let editName = undefined;
    let editDescription = undefined;
    const id = parent.querySelector(".item-id").dataset.id;
    const url = `http://localhost:7070?method=ticketById&id=${id}`;

    (async () => {
      const response = await fetch(url);

      if (response.ok) {
        const json = await response.json();

        editName = json.name;
        editDescription = json.description;

        const popupEditElement = document.createElement("div");
        popupEditElement.className = "create_ticket";

        this._element.append(popupEditElement);

        await popupEditElement.insertAdjacentHTML(
          "afterbegin",
          `<div class="create_ticket-container">
              <div class="create_ticket-wrapper">
                <p class="create_ticket-title">Изменить тикет</p>
                <form class="ticket-form">
                  <p class="ticket__name-title">Краткое описание</p>
                  <input type="text" class="ticket__name" name="name" value="${editName}" required>
                  <p class="ticket__description-title">Подробное описание</p>
                  <textarea class="ticket__description" name="description" rows="4" maxlength="300">${editDescription}</textarea>
                  <div class="ticket__buttons">
                    <button class="ticket__btn-cancel" data-action="closePopup">Отмена</button>
                    <button class="ticket__btn-ok">Ok</button>
                  </div>
                </form>
              </div>
            </div>`
        );
        this._popup = popupEditElement;
        this._formElements = this._popup.querySelector(".ticket-form");
        this._formElements.addEventListener("submit", async (e) => {
          const data = new FormData(this._formElements);
          const url = `http://localhost:7070?method=editTicket&id=${id}`;
          const response = await fetch(url, {
            method: "PATCH",
            body: data,
          });

          const result = await response.json();
        });
      } else {
        console.log("Error: " + response.status);
      }
    })();
  }

  createDeleteTicket(elem) {
    const popupElementDelete = document.createElement("div");
    popupElementDelete.className = "create_ticket";

    this._element.append(popupElementDelete);

    popupElementDelete.insertAdjacentHTML(
      "afterbegin",
      ' <div class="create_ticket-container">\n' +
        '      <div class="create_ticket-wrapper">\n' +
        '        <p class="create_ticket-title delete">Удалить тикет</p>\n' +
        '          <p class="ticket__name-title delete">Вы уверены, что хотите удалить тикет?</p>\n' +
        '          <div class="ticket__buttons">\n' +
        '            <button class="ticket__btn-cancel" data-action="closePopup">Отмена</button>\n' +
        '            <button class="ticket__btn-ok" data-action="deleteTicket">Ok</button>\n' +
        "          </div>\n" +
        "      </div>\n" +
        "    </div>"
    );

    this._popup = popupElementDelete;
    this._ticketId = elem.closest(".ticket");
  }

  addTicket() {
    this._formElements.addEventListener("submit", async (e) => {
      const data = new FormData(this._formElements);
      const url = "http://localhost:7070?method=createTicket";
      const response = await fetch(url, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      this._ticketItem.addNewTicket(
        result.id,
        result.status,
        result.name,
        result.created
      );
    });
  }

  closePopup() {
    this._popup.remove();
  }
}
