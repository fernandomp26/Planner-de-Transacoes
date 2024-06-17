// adição de classes iniciais
document.addEventListener('DOMContentLoaded', function () {
    getTransactions();
    mainTitle1.classList.add('loaded');
    mainText1.classList.add('loaded');
})
// --------

// animação dos links de navegação
const header = document.querySelector('header');
let isOpen = false;

const links = document.querySelectorAll('header .links a');
const buttonOpenHeader = document.querySelector('header .open-menu');

// selecionando os mains
const main1 = document.querySelector('main.main-1');
const main2 = document.querySelector('main.main-2');

// selecionando textos principais
const mainTitle1 = document.querySelector('main h1');
const mainText1 = document.querySelector('main p');
const mainTitle2 = document.querySelector('main.main-2 h1');
const mainText2 = document.querySelector('main.main-2 p.description');

// selecionando tag mãe dos cards e os cards
const section = document.querySelector('main section');
const cards = document.querySelectorAll('main section .card-container');

// selecionando itens necessários para funcionamento do modal
const modal = document.querySelector('.add-modal');
const openModalButtton = document.querySelector('main .main-header a');
const closeModalButton = document.querySelector('main .add-modal .modal .header button.close-button');

// selecionando o parágrafo de 'sem transações'
const noTransactions = document.querySelector('main p.value-message');

//selecionando inputs
const inputTitle = document.querySelector('main .add-modal .modal .content form.minimal-form .input-group #title');
const inputDescription = document.querySelector('main .add-modal .modal .content form.minimal-form .input-group #description');
const inputValue = document.querySelector('main .add-modal .modal .content form.minimal-form .input-group #value');
const inputRadio = document.querySelectorAll('main .add-modal .modal .content form.minimal-form .input-group .radio-group label input');

// selecionando os cards do main 2
const cards2 = document.querySelectorAll('main.main-2 section .resume')

// funções para abertura e fechamento dos modais
const openModal = () => {
    modal.classList.add('open');
}

const closeModal = () => {
    modal.classList.remove('open');
    links[0].classList.add('active');
    links[1].classList.remove('active');
    resetInputs();
}

const resetInputs = () => {
    inputTitle.value = ''
    inputDescription.value = ''
    inputValue.value = ''
    inputRadio.value = ''
}

// adicionando evento de click nos links e botão de abertura e fechamento dos modais, respectivamente
openModalButtton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
// --------

// funções para abertura e fechamento do menu 
const openMenu = () => {
    if(isOpen) {
        header.classList.remove('open');
        buttonOpenHeader.classList.add('rotate');
    } else {
        header.classList.add('open');
        buttonOpenHeader.classList.remove('rotate');
    }
    isOpen = !isOpen;
}

buttonOpenHeader.addEventListener('click', openMenu)

// --------


// menu animado
const setActive = (event) => {
    links.forEach(link => {
        link.classList.remove('active');
    });

    event.target.classList.add('active');
}

const showMain1 = () => {
    getTransactions();
    main1.classList.remove('hidden');
    main2.classList.add('hidden');
    mainTitle2.classList.remove('loaded');
    mainText2.classList.remove('loaded');

    mainTitle1.classList.add('loaded');
    mainText1.classList.add('loaded');

    const cards2 = document.querySelectorAll('main.main-2 section .card')
    cards2.forEach((card) => {
        card.classList.remove('resume')
    })
}

const showMain2 = () => {
    getStatistics();
    main2.classList.remove('hidden');
    main1.classList.add('hidden');
    mainTitle1.classList.remove('loaded');
    mainText1.classList.remove('loaded');

    mainTitle2.classList.add('loaded');
    mainText2.classList.add('loaded');

    cards2.forEach((card, index) => {
        setTimeout(() => {
            card.classList.remove('resume')
        }, index * 500)
    })

    cards.forEach((card) => {
        card.classList.remove('visible')
    })
}
// --------

// adicionando o evento de clique em cada link
links.forEach(link => {
    link.addEventListener('click', setActive);
});

links[0].addEventListener('click', showMain1)
links[1].addEventListener('click', showMain2)
// -------

// mostrando um card para cada transação realizada
async function getTransactions() {
    let cardList = '';
    let transactions = []
    noTransactions.innerHTML = '';

    try {
        const transactionsData = await fetch('http://localhost:3001/transactions');
        transactions = await transactionsData.json();

        if (transactions.length == 0) {
            section.innerHTML = ''
            noTransactions.innerHTML = 'Você não tem transações cadastradas ainda. Crie uma selecionando <b>CRIAR</b> no topo da página.'
            return;
        }

        for (i = 0; i < transactions.length; i++) {
            let current = transactions[i];
            cardList += `
                <div class="card-container">
                    <div class="card-header">
                        <div class="texts">
                            <h1>${current.title}</h1>
                            <p>
                                ${current.description}
                            </p>
                        </div>
                        <button class="card-delete" onclick='deleteTransaction("${current.id}")'>
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                    <div class="card-content">
                        <p class="content-value">R$ <span>${Math.abs(current.value).toFixed(2)}</span></p>
                        ${current.value < 0 ? '<i class="bi bi-graph-down-arrow exit"></i>' : '<i class="bi bi-graph-up-arrow enter"></i>'}
                    </div>
                </div>
            `
        }
        section.innerHTML = cardList;
        const cards = document.querySelectorAll('main section .card-container')
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible')
            }, index * 300)
        })
    } catch (e) {
        noTransactions.innerHTML = 'Erro ao acessar as transações'
    }
}

async function handleSubmit() {
    for (const radio of inputRadio) {
        if (radio.checked && radio.value === 'transferencia') {
            let data = {
                title: inputTitle.value,
                description: inputDescription.value,
                value: parseFloat(inputValue.value) * (-1)
            }
            console.log(data)
            const created = await fetch('http://localhost:3001/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            console.log(created)
            getTransactions();
            break;
        } else {
            let data = {
                title: inputTitle.value,
                description: inputDescription.value,
                value: parseFloat(inputValue.value)
            }
            const created = await fetch('http://localhost:3001/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            console.log(created);
            getTransactions();
            break;
        }
    }
    closeModal();
}

async function deleteTransaction(id) {
    await fetch(`http://localhost:3001/transactions/${id}`, {
        method: "DELETE"
    })
    location.reload();
}

async function getStatistics() {
    const section2 = document.querySelector('main.main-2 section');

    section2.innerHTML = '';
    let transactions = [];
    let positive = 0;
    let positiveQuantity = 0;
    let negative = 0;

    const transactionsData = await fetch('http://localhost:3001/transactions');
    transactions = await transactionsData.json();

    transactions.forEach(current => {
        if (current.value > 0) {
            positive += current.value;
            positiveQuantity++;
        } else {
            negative += current.value;
        }
    });

    const totalTransactions = transactions.length;
    const percentageTotal = parseInt((totalTransactions * 100) / 50);
    const percentagePositive = parseInt((positiveQuantity * 100) / totalTransactions);

    const statisticList = `
            <div class="card-1 card">
                <h1>Total de transações cadastradas</h1>
                <div class="bottom">
                    <p>${totalTransactions}<span>/50</span></p>
                    <div class="bar">
                        <div class="loading purple" style="width: ${percentageTotal}%"></div>
                    </div>
                </div>
            </div>

            <div class="card-2 card">
                <h1>Porcentagem de transações benéficas</h1>
                <div class="bottom">
                    <p>${percentagePositive}<span>%</span></p>
                    <div class="bar">
                        <div class="loading orange" style="width: ${percentagePositive}%"></div>
                    </div>
                </div>
            </div>

            <div class="card-3 card">
                <h1>Total de dinheiro enviado</h1>
                <div class="bottom">
                    <p><span>R$ </span>-${Math.abs(negative).toFixed(2)} <span><i class="bi bi-graph-down-arrow"></i></span></p>
                    <div class="bar">
                        <div class="loading purple" style="width: ${Math.abs(negative)}px"></div>
                    </div>
                </div>
            </div>

            <div class="card-4 card">
                <h1>Total de dinheiro recebido</h1>
                <div class="bottom">
                    <p><span>R$ </span>+${positive.toFixed(2)} <span><i class="bi bi-graph-up-arrow"></i></span></p>
                    <div class="bar">
                        <div class="loading orange" style="width: ${positive}px"></div>
                    </div>
                </div>
            </div>
        `

    section2.innerHTML = statisticList;
    const cardsStatistic = document.querySelectorAll('main.main-2 section .card');
    cardsStatistic.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('resume');
        }, index * 500);
    });
}
