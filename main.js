const prices = {
    Acetaminophen_500mg:1120.00,
    Acetaminophenand_Hydrocodone_325_10mg:2200.00,
    Acetaminophen_aspirin:3600.00,
    Aimovig_70mg:700.00,
    Celecoxib_200mg:520.00,
    Sumathriptan_Succinate_100mg:3990.00,
    amoxicillin:450.00,
    Azithromycin_Dihydrate_500mg:770.00,
    Cephalexin_Monohydrate_500mg:1100.00,
    Cipro_500mg:330.00,
    Levofloxacin_500mg:2200.00,
    Sulfamethoxazole_800mg:3000.00,
    Amitriptyline_Hydrochloride_25mg_2:1230.00,
    Amitriptyline_Hydrochloride_25mg:4100.00,
    Mirtazapine_30mg:2100.00,
    Phenelzine_Sulfate_15mg:900.00,
    Sertraline_Hydrochloride_50mg:855.00,
    Trazodone_Hydrochloride_50mg:770.00,
    Hydroxyzine_Hydrochloride_25mg:550.00,
    Hydroxyzine_Pamoate_25mg:2120.00,
    Hydroxyzine_Pamoate:950.00,
    hydroxyzine_hydrochloride_30mg:1000.00,
    AmlodipineBesylate_Hydrochloride_5mg_20mg:2000.00,
    AmlodipineBesylate_and_Valsartan_10mg_320mg:3200.00,
    Hydrochlorothiazide_and_lisinopril_125mg:450.00,
    Hydrochlorothiazide_and_LosartanPotassium_25mg_100mg:599.00,
    Hydrochlorothiazide_and_Methyldopa_25mg_250mg:850.00,
    Hydrochlorothiazide_and_Triamterene_25mg_375mg:995.00
};


function addItemToOrder(itemId, quantity) {
    if (quantity <= 0) {
        alert('Need more than 0');
        return;
    }

    const tableBody = document.querySelector('#order-table tbody');
    let existingRow = null;

    Array.from(tableBody.rows).forEach(row => {
        if (row.cells[0].textContent === itemId) {
            existingRow = row;
        }
    });

    if (existingRow) {
        const newQuantity = parseFloat(existingRow.cells[1].textContent) + parseFloat(quantity);
        existingRow.cells[1].textContent = newQuantity;
        existingRow.cells[2].textContent = (newQuantity * prices[itemId]).toFixed(2);
    } else {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = itemId;
        row.insertCell(1).textContent = quantity;
        row.insertCell(2).textContent = (quantity * prices[itemId]).toFixed(2);

        // remove button
        const removeCell = row.insertCell(3);
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeCell.appendChild(removeButton);
        removeButton.addEventListener('click', () => {
            row.remove();
            updateTotalPrice();
        });
    }

    updateTotalPrice();
    alert(`You added ${quantity} item/s of ${itemId.replace(/_/g, ' ')}`);
}

function updateTotalPrice() {
    const tableBody = document.querySelector('#order-table tbody');
    let totalPrice = 0;

    Array.from(tableBody.rows).forEach(row => {
        totalPrice += parseFloat(row.cells[2].textContent);
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-item');
        const quantity = parseFloat(document.getElementById(itemId).value);
        if (isNaN(quantity) || quantity === 0) {
            alert('Enter a valid amount');
        } else if (quantity > 0) {
            addItemToOrder(itemId, quantity);
        }
    });
});

document.getElementById('add-to-favourites').addEventListener('click', () => {
    const formData = new FormData(document.getElementById('medicine_form'));
    const favouriteItems = {};

    formData.forEach((value, key) => {
        if (parseFloat(value) > 0) {
            favouriteItems[key] = value;
        }
    });

    localStorage.setItem('favouriteOrder', JSON.stringify(favouriteItems));
    alert('store items added to the favourite');
});

document.getElementById('apply-favourites').addEventListener('click', () => {
    const favouriteItems = JSON.parse(localStorage.getItem('favouriteOrder'));

    if (favouriteItems) {
        for (const [key, value] of Object.entries(favouriteItems)) {
            document.getElementById(key).value = value;
            addItemToOrder(key, value);
        }
    }
    localStorage.setItem('applyOrder', JSON.stringify(favouriteItems));
    alert('applied to favourite');
});

document.getElementById('clear-favourites').addEventListener('click', () => {
    localStorage.removeItem('favouriteOrder');
    alert('Favourite order list cleared!');
});

document.getElementById('buy-now').addEventListener('click', () => {
    const tableBody = document.querySelector('#order-table tbody');
    if (tableBody.rows.length > 0) {
        const orderItems = [];

        Array.from(tableBody.rows).forEach(row => {
            orderItems.push({
                item: row.cells[0].textContent,
                quantity: row.cells[1].textContent,
                price: row.cells[2].textContent
            });
        });

        localStorage.setItem('orderItems', JSON.stringify(orderItems));
        window.location.hrf = 'summary.html';
    } else {
        alert('Please add items(medicine) to your order before proceeding.');
    }
});
