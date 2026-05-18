const currentPage = document.body.dataset.page;

document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const isActive = link.dataset.navLink === currentPage;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
        link.setAttribute("aria-current", "page");
    } else {
        link.removeAttribute("aria-current");
    }
});

const toggleButton = document.querySelector("[data-sidebar-toggle]");
const sidebarNav = document.querySelector("[data-sidebar-nav]");

if (toggleButton && sidebarNav) {
    toggleButton.addEventListener("click", () => {
        const isOpen = sidebarNav.classList.toggle("is-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
    });
}

document.querySelectorAll("[data-copy-textarea]").forEach((button) => {
    button.addEventListener("click", async () => {
        const field = document.getElementById(button.dataset.copyTextarea);
        const feedback = document.getElementById(button.dataset.copyFeedback);

        if (!field || !feedback) {
            return;
        }

        const text = field.value.trim();

        if (!text) {
            feedback.textContent = "Vul eerst jouw wens in.";
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            feedback.textContent = "Jouw wens is gekopieerd.";
        } catch (error) {
            field.focus();
            field.select();
            feedback.textContent = "Jouw tekst is geselecteerd. Gebruik kopieren om verder te gaan.";
        }
    });
});

document.querySelectorAll("[data-set-field]").forEach((button) => {
    button.addEventListener("click", () => {
        const field = document.getElementById(button.dataset.setField);

        if (!field) {
            return;
        }

        field.value = button.dataset.setValue || "";
    });
});

document.querySelectorAll("[data-price-select]").forEach((select) => {
    const target = document.getElementById(select.dataset.priceTarget);

    if (!target) {
        return;
    }

    const renderSelectedPrice = () => {
        const option = select.options[select.selectedIndex];

        if (!option) {
            return;
        }

        target.innerHTML = `
            <strong>${option.value}</strong>
            <span>${option.dataset.note || ""}</span>
            <b>${option.dataset.price || ""}</b>
        `;
    };

    select.addEventListener("change", renderSelectedPrice);
    renderSelectedPrice();
});

document.querySelectorAll("[data-tier-card]").forEach((card) => {
    const buttons = Array.from(card.querySelectorAll("[data-tier-button]"));
    const price = card.querySelector('[data-tier-output="price"]');
    const note = card.querySelector('[data-tier-output="note"]');
    const metaOne = card.querySelector('[data-tier-output="meta-one"]');
    const metaTwo = card.querySelector('[data-tier-output="meta-two"]');

    if (!buttons.length) {
        return;
    }

    const renderTier = (button) => {
        buttons.forEach((candidate) => {
            const isActive = candidate === button;
            candidate.classList.toggle("is-active", isActive);
            candidate.setAttribute("aria-pressed", String(isActive));
        });

        if (price) {
            price.textContent = button.dataset.tierPrice || "";
        }

        if (note) {
            note.textContent = button.dataset.tierNote || "";
        }

        if (metaOne) {
            metaOne.textContent = button.dataset.tierMetaOne || "";
        }

        if (metaTwo) {
            metaTwo.textContent = button.dataset.tierMetaTwo || "";
        }
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            renderTier(button);
        });
    });

    renderTier(buttons.find((button) => button.classList.contains("is-active")) || buttons[0]);
});

document.querySelectorAll("[data-build-training-request]").forEach((button) => {
    button.addEventListener("click", async () => {
        const tier = document.getElementById("training-tier");
        const kinks = document.getElementById("training-kinks");
        const nogos = document.getElementById("training-nogos");
        const feedback = document.getElementById(button.dataset.copyFeedback);

        if (!tier || !kinks || !nogos || !feedback) {
            return;
        }

        const requestText = [
            `Pakket: ${tier.value}`,
            `Kinks / voorkeuren: ${kinks.value.trim() || "-"}`,
            `No-go's / grenzen: ${nogos.value.trim() || "-"}`
        ].join("\n");

        if (tier.value === "Kies een pakket" && !kinks.value.trim() && !nogos.value.trim()) {
            feedback.textContent = "Kies eerst een pakket of vul voorkeuren in.";
            return;
        }

        try {
            await navigator.clipboard.writeText(requestText);
            feedback.textContent = "Trainingsaanvraag is gekopieerd.";
        } catch (error) {
            kinks.focus();
            kinks.select();
            feedback.textContent = "Automatisch kopieren lukte niet. De velden zijn wel klaar om handmatig te kopieren.";
        }
    });
});

document.querySelectorAll("[data-build-custom-request]").forEach((button) => {
    button.addEventListener("click", async () => {
        const tier = document.getElementById("custom-tier");
        const style = document.getElementById("custom-style");
        const request = document.getElementById("custom-request-text");
        const details = document.getElementById("custom-details-text");
        const feedback = document.getElementById(button.dataset.copyFeedback);

        if (!tier || !style || !request || !details || !feedback) {
            return;
        }

        const requestText = [
            `Pakket: ${tier.value}`,
            `Richting: ${style.value}`,
            `Basiswens: ${request.value.trim() || "-"}`,
            `Beschrijving custom: ${details.value.trim() || "-"}`
        ].join("\n");

        if (tier.value === "Kies een pakket" && !request.value.trim() && !details.value.trim()) {
            feedback.textContent = "Kies eerst een pakket of vul jouw custom in.";
            return;
        }

        try {
            await navigator.clipboard.writeText(requestText);
            feedback.textContent = "Custom aanvraag is gekopieerd.";
        } catch (error) {
            request.focus();
            request.select();
            feedback.textContent = "Automatisch kopieren lukte niet. De velden zijn wel klaar om handmatig te kopieren.";
        }
    });
});

document.querySelectorAll("[data-buy-now]").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest("[data-buy-card]");
        const activeTier = card?.querySelector("[data-tier-button].is-active") || card?.querySelector("[data-tier-button]");
        const productKey = card?.dataset.productKey;
        const tierId = activeTier?.dataset.tierId;

        if (!productKey || !tierId) {
            window.location.href = "bestellen.html";
            return;
        }

        const targetUrl = new URL("bestellen.html", window.location.href);
        targetUrl.searchParams.set("product", productKey);
        targetUrl.searchParams.set("tier", tierId);
        window.location.href = targetUrl.toString();
    });
});

const orderSystem = document.querySelector("[data-order-system]");

if (orderSystem) {
    const orderStorageKey = "sarrissa-candy-order-cart-v1";
    const orderCatalog = {
        video: {
            name: "Video",
            description: "Losse videos of bundels die direct digitaal geleverd worden.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.21.11.jpeg",
            tags: ["Digitaal", "Direct", "Flexibel"],
            tiers: [
                { id: "losse", label: "Losse", price: 20, note: "eenmalig", detail: "1 video" },
                { id: "brons", label: "Brons", price: 45, note: "eenmalig", detail: "3 video's" },
                { id: "zilver", label: "Zilver", price: 75, note: "eenmalig", detail: "5 video's" },
                { id: "goud", label: "Goud", price: 100, note: "eenmalig", detail: "8 video's" }
            ]
        },
        "custom-video": {
            name: "Custom Video",
            description: "Korte of lange custom video op maat met vaste treden.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.43.06.jpeg",
            tags: ["Maatwerk", "Video", "Premium"],
            tiers: [
                { id: "1-2m", label: "1-2m", price: 35, note: "eenmalig", detail: "1 tot 2 minuten" },
                { id: "4-6m", label: "4-6m", price: 85, note: "eenmalig", detail: "4 tot 6 minuten" },
                { id: "8-10m", label: "8-10m", price: 150, note: "eenmalig", detail: "8 tot 10 minuten" },
                { id: "15-20m", label: "15-20m", price: 200, note: "eenmalig", detail: "15 tot 20 minuten" }
            ]
        },
        "foto-op-maat": {
            name: "Foto Op Maat",
            description: "Custom foto's in drie vaste bundels, volledig op wens afgestemd.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.25.00.jpeg",
            tags: ["Custom", "Foto", "Persoonlijk"],
            tiers: [
                { id: "brons", label: "Brons", price: 35, note: "eenmalig", detail: "10 foto's" },
                { id: "zilver", label: "Zilver", price: 55, note: "eenmalig", detail: "25 foto's" },
                { id: "goud", label: "Goud", price: 100, note: "eenmalig", detail: "50 foto's" }
            ]
        },
        "extra-opties": {
            name: "Extra Opties",
            description: "Persoonlijke toevoegingen en spoedopties als losse upgrade.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.51.21.jpeg",
            tags: ["Add-on", "Spoed", "Upgrade"],
            tiers: [
                { id: "naam", label: "Naam", price: 10, note: "toeslag", detail: "Persoonlijke toevoeging" },
                { id: "24u", label: "24u", price: 75, note: "toeslag", detail: "Binnen 24 uur" },
                { id: "48u", label: "48u", price: 50, note: "toeslag", detail: "Binnen 48 uur" }
            ]
        },
        videocall: {
            name: "Videocall",
            description: "Korte of langere videocall met directe tijdsopbouw.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.43.23.jpeg",
            tags: ["Live", "Call", "1-op-1"],
            tiers: [
                { id: "3min", label: "3 min", price: 30, note: "per call", detail: "3 minuten" },
                { id: "5min", label: "5 min", price: 50, note: "per call", detail: "5 minuten" },
                { id: "10min", label: "10 min", price: 75, note: "per call", detail: "10 minuten" },
                { id: "15min", label: "15 min", price: 110, note: "per call", detail: "15 minuten" }
            ]
        },
        "prive-chat": {
            name: "Prive Chat",
            description: "Persoonlijk contact in drie chat tiers met oplopende duur.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.37.18.jpeg",
            tags: ["Chat", "Privaat", "Direct"],
            tiers: [
                { id: "brons", label: "Brons", price: 70, note: "per sessie", detail: "15 minuten" },
                { id: "zilver", label: "Zilver", price: 120, note: "per sessie", detail: "30 minuten" },
                { id: "goud", label: "Goud", price: 200, note: "per sessie", detail: "60 minuten" }
            ]
        },
        trainingen: {
            name: "Trainingen",
            description: "Van een korte instapweek tot een volledig maandtraject.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.39.06.jpeg",
            tags: ["Traject", "Begeleiding", "Groei"],
            tiers: [
                { id: "brons", label: "Brons", price: 125, note: "per traject", detail: "1 week" },
                { id: "zilver", label: "Zilver", price: 200, note: "per traject", detail: "2 weken" },
                { id: "goud", label: "Goud", price: 350, note: "per traject", detail: "1 maand" }
            ]
        },
        "foto-bundels": {
            name: "Foto Bundels",
            description: "Pre-made fotosets in vaste aantallen voor snelle keuze.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.51.36.jpeg",
            tags: ["Foto", "Bundel", "Download"],
            tiers: [
                { id: "brons", label: "Brons", price: 20, note: "eenmalig", detail: "10 foto's" },
                { id: "zilver", label: "Zilver", price: 40, note: "eenmalig", detail: "25 foto's" },
                { id: "goud", label: "Goud", price: 70, note: "eenmalig", detail: "50 foto's" }
            ]
        },
        "opdracht-bundels": {
            name: "Opdracht Bundels",
            description: "Meer opdrachten in vaste bundels voor grotere aankopen.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.18.36.jpeg",
            tags: ["Bundel", "Opdrachten", "Value"],
            tiers: [
                { id: "brons", label: "Brons", price: 40, note: "eenmalig", detail: "3 opdrachten" },
                { id: "zilver", label: "Zilver", price: 75, note: "eenmalig", detail: "6 opdrachten" },
                { id: "goud", label: "Goud", price: 120, note: "eenmalig", detail: "10 opdrachten" }
            ]
        },
        "custom-opdrachten": {
            name: "Custom Opdrachten",
            description: "Los maatwerk in drie niveaus, afhankelijk van hoeveel je wilt.",
            image: "images/WhatsApp%20Image%202026-05-06%20at%2015.15.39.jpeg",
            tags: ["Custom", "Opdracht", "Maatwerk"],
            tiers: [
                { id: "brons", label: "Brons", price: 40, note: "eenmalig", detail: "1 opdracht" },
                { id: "zilver", label: "Zilver", price: 110, note: "eenmalig", detail: "3 opdrachten" },
                { id: "goud", label: "Goud", price: 175, note: "eenmalig", detail: "5 opdrachten" }
            ]
        }
    };
    const currencyFormatter = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR"
    });
    const orderCatalogContainer = document.querySelector("[data-order-catalog]");
    const orderBuilder = orderSystem.querySelector("[data-order-builder]");
    const orderProductSelect = orderSystem.querySelector("[data-order-product-select]");
    const orderTierSelect = orderSystem.querySelector("[data-order-tier-select]");
    const orderQuantity = orderSystem.querySelector("[data-order-quantity]");
    const orderLineNote = orderSystem.querySelector("[data-order-line-note]");
    const orderPreviewName = orderSystem.querySelector("[data-order-preview-name]");
    const orderPreviewMeta = orderSystem.querySelector("[data-order-preview-meta]");
    const orderPreviewPrice = orderSystem.querySelector("[data-order-preview-price]");
    const orderBuilderFeedback = orderSystem.querySelector("[data-order-builder-feedback]");
    const orderCart = orderSystem.querySelector("[data-order-cart]");
    const orderEmpty = orderSystem.querySelector("[data-order-empty]");
    const orderSubtotal = orderSystem.querySelector("[data-order-subtotal]");
    const orderTotal = orderSystem.querySelector("[data-order-total]");
    const orderCount = orderSystem.querySelector("[data-order-count]");
    const orderFeedback = orderSystem.querySelector("[data-order-feedback]");
    const orderCopyButton = orderSystem.querySelector("[data-order-copy]");
    const orderClearButton = orderSystem.querySelector("[data-order-clear]");
    const orderCustomerForm = orderSystem.querySelector("[data-order-customer-form]");
    const orderState = {
        cart: loadStoredCart()
    };

    function formatPrice(value) {
        return currencyFormatter.format(value || 0);
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character] || character;
        });
    }

    function createOrderId() {
        return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function loadStoredCart() {
        try {
            const storedCart = window.localStorage.getItem(orderStorageKey);
            const parsedCart = storedCart ? JSON.parse(storedCart) : [];

            return Array.isArray(parsedCart) ? parsedCart : [];
        } catch (error) {
            return [];
        }
    }

    function saveStoredCart() {
        window.localStorage.setItem(orderStorageKey, JSON.stringify(orderState.cart));
    }

    function getCatalogKeys() {
        return Object.keys(orderCatalog);
    }

    function getProduct(productKey) {
        return orderCatalog[productKey] || null;
    }

    function getTier(productKey, tierId) {
        const product = getProduct(productKey);

        if (!product) {
            return null;
        }

        return product.tiers.find((tier) => tier.id === tierId) || null;
    }

    function setOrderBuilderFeedback(message) {
        if (orderBuilderFeedback) {
            orderBuilderFeedback.textContent = message;
        }
    }

    function setOrderFeedback(message) {
        if (orderFeedback) {
            orderFeedback.textContent = message;
        }
    }

    function renderOrderCatalog() {
        if (!orderCatalogContainer) {
            return;
        }

        orderCatalogContainer.innerHTML = getCatalogKeys().map((productKey) => {
            const product = getProduct(productKey);
            const startingPrice = product.tiers.reduce((minimum, tier) => Math.min(minimum, tier.price), product.tiers[0].price);

            return `
                <article class="order-product-card">
                    <div class="order-product-media">
                        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
                    </div>
                    <div class="order-product-body">
                        <div class="order-product-top">
                            <h3>${escapeHtml(product.name)}</h3>
                            <span class="price-chip">Vanaf ${escapeHtml(formatPrice(startingPrice))}</span>
                        </div>
                        <p>${escapeHtml(product.description)}</p>
                        <div class="tag-row">
                            ${product.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
                        </div>
                        <button class="ghost-link client-secondary-button" type="button" data-order-pick="${escapeHtml(productKey)}">Kies dit product</button>
                    </div>
                </article>
            `;
        }).join("");
    }

    function renderProductOptions() {
        if (!orderProductSelect) {
            return;
        }

        orderProductSelect.innerHTML = getCatalogKeys().map((productKey) => {
            const product = getProduct(productKey);
            return `<option value="${escapeHtml(productKey)}">${escapeHtml(product.name)}</option>`;
        }).join("");
    }

    function renderTierOptions(productKey, preferredTierId) {
        if (!orderTierSelect) {
            return;
        }

        const product = getProduct(productKey);

        if (!product) {
            orderTierSelect.innerHTML = "";
            return;
        }

        orderTierSelect.innerHTML = product.tiers.map((tier) => `
            <option value="${escapeHtml(tier.id)}"${tier.id === preferredTierId ? " selected" : ""}>
                ${escapeHtml(tier.label)} · ${escapeHtml(tier.detail)} · ${escapeHtml(formatPrice(tier.price))}
            </option>
        `).join("");

        if (!preferredTierId) {
            orderTierSelect.value = product.tiers[0].id;
        }
    }

    function renderSelectionPreview() {
        if (!orderProductSelect || !orderTierSelect || !orderPreviewName || !orderPreviewMeta || !orderPreviewPrice) {
            return;
        }

        const product = getProduct(orderProductSelect.value);
        const tier = getTier(orderProductSelect.value, orderTierSelect.value);
        const quantity = Math.max(1, Number(orderQuantity?.value || 1));

        if (!product || !tier) {
            return;
        }

        orderPreviewName.textContent = `${product.name} - ${tier.label}`;
        orderPreviewMeta.textContent = `${tier.detail} · ${tier.note} · aantal ${quantity}`;
        orderPreviewPrice.textContent = formatPrice(tier.price * quantity);
    }

    function renderCart() {
        if (!orderCart || !orderEmpty || !orderSubtotal || !orderTotal || !orderCount) {
            return;
        }

        const validItems = orderState.cart.filter((item) => getProduct(item.productKey) && getTier(item.productKey, item.tierId));
        const totalQuantity = validItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotalValue = validItems.reduce((sum, item) => {
            const tier = getTier(item.productKey, item.tierId);
            return sum + ((tier?.price || 0) * item.quantity);
        }, 0);

        orderCart.innerHTML = validItems.map((item) => {
            const product = getProduct(item.productKey);
            const tier = getTier(item.productKey, item.tierId);
            const itemTotal = (tier?.price || 0) * item.quantity;

            return `
                <article class="order-cart-item">
                    <div class="order-cart-head">
                        <div>
                            <h3 class="order-cart-title">${escapeHtml(product.name)} - ${escapeHtml(tier.label)}</h3>
                            <p class="order-cart-copy">${escapeHtml(tier.detail)} · ${escapeHtml(tier.note)}</p>
                        </div>
                        <button class="order-cart-remove" type="button" data-order-remove="${escapeHtml(item.id)}">Verwijderen</button>
                    </div>
                    <div class="order-cart-meta">
                        <span>Aantal: ${escapeHtml(String(item.quantity))}</span>
                        <span>Prijs: ${escapeHtml(formatPrice(itemTotal))}</span>
                    </div>
                    <p class="order-cart-note">${escapeHtml(item.note || "Geen extra wens toegevoegd.")}</p>
                </article>
            `;
        }).join("");

        orderEmpty.hidden = validItems.length !== 0;
        orderCount.textContent = `${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`;
        orderSubtotal.textContent = formatPrice(subtotalValue);
        orderTotal.textContent = formatPrice(subtotalValue);
    }

    function addItemToCart(productKey, tierId, quantity, note) {
        const product = getProduct(productKey);
        const tier = getTier(productKey, tierId);

        if (!product || !tier) {
            setOrderBuilderFeedback("Deze productkeuze kon niet worden toegevoegd.");
            return;
        }

        const normalisedQuantity = Math.max(1, Number(quantity || 1));
        const lineNote = String(note || "").trim();
        const existingItem = orderState.cart.find((item) => item.productKey === productKey && item.tierId === tierId && item.note === lineNote);

        if (existingItem) {
            existingItem.quantity += normalisedQuantity;
        } else {
            orderState.cart.unshift({
                id: createOrderId(),
                productKey,
                tierId,
                quantity: normalisedQuantity,
                note: lineNote
            });
        }

        saveStoredCart();
        renderCart();
        setOrderBuilderFeedback(`${product.name} (${tier.label}) is toegevoegd.`);
    }

    function copyOrderSummary() {
        if (!orderCustomerForm || !orderState.cart.length) {
            setOrderFeedback("Voeg eerst minstens een product toe.");
            return;
        }

        const name = String(orderCustomerForm.elements.name?.value || "").trim();
        const contact = String(orderCustomerForm.elements.contact?.value || "").trim();
        const channel = String(orderCustomerForm.elements.channel?.value || "").trim();
        const delivery = String(orderCustomerForm.elements.delivery?.value || "").trim();
        const notes = String(orderCustomerForm.elements.notes?.value || "").trim();

        if (!name || !contact) {
            setOrderFeedback("Vul eerst naam en contact in.");
            return;
        }

        const lines = orderState.cart
            .filter((item) => getProduct(item.productKey) && getTier(item.productKey, item.tierId))
            .map((item, index) => {
                const product = getProduct(item.productKey);
                const tier = getTier(item.productKey, item.tierId);
                const baseLine = `${index + 1}. ${product.name} - ${tier.label} x${item.quantity} = ${formatPrice(tier.price * item.quantity)}`;
                const detailLine = `   ${tier.detail} | ${tier.note}`;
                const noteLine = item.note ? `   Wens: ${item.note}` : "";

                return [baseLine, detailLine, noteLine].filter(Boolean).join("\n");
            });

        const totalValue = orderState.cart.reduce((sum, item) => {
            const tier = getTier(item.productKey, item.tierId);
            return sum + ((tier?.price || 0) * item.quantity);
        }, 0);

        const requestText = [
            "Bestelling Sarrissa Candy",
            `Naam: ${name}`,
            `Contact: ${contact}`,
            `Voorkeurskanaal: ${channel || "-"}`,
            `Levering: ${delivery || "-"}`,
            "",
            "Producten:",
            lines.join("\n"),
            "",
            `Totaal: ${formatPrice(totalValue)}`,
            `Algemene notities: ${notes || "-"}`
        ].join("\n");

        navigator.clipboard.writeText(requestText).then(() => {
            setOrderFeedback("De bestelling is gekopieerd en klaar om te versturen.");
        }).catch(() => {
            setOrderFeedback("Kopieren lukte niet in deze browser.");
        });
    }

    function hydrateFromQueryString() {
        const params = new URLSearchParams(window.location.search);
        const productKey = params.get("product");
        const tierId = params.get("tier");

        if (!productKey || !tierId || !getProduct(productKey) || !getTier(productKey, tierId)) {
            return;
        }

        if (orderProductSelect) {
            orderProductSelect.value = productKey;
        }

        renderTierOptions(productKey, tierId);
        renderSelectionPreview();
        addItemToCart(productKey, tierId, 1, "");
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    renderOrderCatalog();
    renderProductOptions();

    if (orderProductSelect) {
        renderTierOptions(orderProductSelect.value || getCatalogKeys()[0], null);
        orderProductSelect.addEventListener("change", () => {
            renderTierOptions(orderProductSelect.value, null);
            renderSelectionPreview();
        });
    }

    if (orderTierSelect) {
        orderTierSelect.addEventListener("change", renderSelectionPreview);
    }

    if (orderQuantity) {
        orderQuantity.addEventListener("input", renderSelectionPreview);
    }

    if (orderBuilder) {
        orderBuilder.addEventListener("submit", (event) => {
            event.preventDefault();
            addItemToCart(orderProductSelect?.value, orderTierSelect?.value, orderQuantity?.value, orderLineNote?.value);

            if (orderQuantity) {
                orderQuantity.value = "1";
            }

            if (orderLineNote) {
                orderLineNote.value = "";
            }

            renderSelectionPreview();
        });
    }

    if (orderCatalogContainer) {
        orderCatalogContainer.addEventListener("click", (event) => {
            const button = event.target.closest("[data-order-pick]");

            if (!button || !orderProductSelect) {
                return;
            }

            const productKey = button.dataset.orderPick;
            const product = getProduct(productKey);

            if (!product) {
                return;
            }

            orderProductSelect.value = productKey;
            renderTierOptions(productKey, product.tiers[0].id);
            renderSelectionPreview();
            setOrderBuilderFeedback(`${product.name} staat klaar om toe te voegen.`);
            orderBuilder?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    if (orderCart) {
        orderCart.addEventListener("click", (event) => {
            const button = event.target.closest("[data-order-remove]");

            if (!button) {
                return;
            }

            orderState.cart = orderState.cart.filter((item) => item.id !== button.dataset.orderRemove);
            saveStoredCart();
            renderCart();
            setOrderFeedback("Het product is verwijderd uit de bestelling.");
        });
    }

    if (orderCopyButton) {
        orderCopyButton.addEventListener("click", copyOrderSummary);
    }

    if (orderClearButton) {
        orderClearButton.addEventListener("click", () => {
            orderState.cart = [];
            saveStoredCart();
            renderCart();
            setOrderFeedback("De bestelling is leeggemaakt.");
        });
    }

    renderSelectionPreview();
    renderCart();
    hydrateFromQueryString();
}

const clientSystem = document.querySelector("[data-client-system]");

if (clientSystem) {
    const clientStorageKey = "sarrissa-candy-customers-v1";
    const clientForm = clientSystem.querySelector("[data-client-form]");
    const clientSubmitButton = clientSystem.querySelector("[data-client-submit]");
    const clientResetButton = clientSystem.querySelector("[data-client-reset]");
    const clientFormTitle = clientSystem.querySelector("#client-form-title");
    const clientFormState = clientSystem.querySelector("[data-client-form-state]");
    const clientFeedback = clientSystem.querySelector("[data-client-feedback]");
    const clientSearch = clientSystem.querySelector("[data-client-search]");
    const clientFilterStatus = clientSystem.querySelector("[data-client-filter-status]");
    const clientSort = clientSystem.querySelector("[data-client-sort]");
    const clientList = clientSystem.querySelector("[data-client-list]");
    const clientEmpty = clientSystem.querySelector("[data-client-empty]");
    const clientResults = clientSystem.querySelector("[data-client-results]");
    const clientExportButton = clientSystem.querySelector("[data-client-export]");
    const clientStats = {
        total: document.querySelector('[data-client-stat="total"]'),
        active: document.querySelector('[data-client-stat="active"]'),
        followup: document.querySelector('[data-client-stat="followup"]'),
        revenue: document.querySelector('[data-client-stat="revenue"]')
    };
    const clientCurrencyFormatter = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR"
    });
    const clientDateFormatter = new Intl.DateTimeFormat("nl-NL", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    const clientState = {
        customers: loadCustomers()
    };

    function loadCustomers() {
        try {
            const storedCustomers = window.localStorage.getItem(clientStorageKey);
            const parsedCustomers = storedCustomers ? JSON.parse(storedCustomers) : [];

            return Array.isArray(parsedCustomers) ? parsedCustomers : [];
        } catch (error) {
            return [];
        }
    }

    function saveCustomers() {
        window.localStorage.setItem(clientStorageKey, JSON.stringify(clientState.customers));
    }

    function escapeClientHtml(value) {
        return String(value || "").replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character] || character;
        });
    }

    function createClientId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function getTodayKey() {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60000;

        return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
    }

    function formatClientAmount(amount) {
        if (typeof amount !== "number" || Number.isNaN(amount)) {
            return "-";
        }

        return clientCurrencyFormatter.format(amount);
    }

    function formatClientDate(value) {
        if (!value) {
            return "Niet gepland";
        }

        const parsedDate = new Date(`${value}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            return value;
        }

        return clientDateFormatter.format(parsedDate);
    }

    function normaliseClientText(value) {
        return String(value || "").trim().toLowerCase();
    }

    function getStatusLabel(status) {
        const labels = {
            nieuw: "Nieuw",
            actief: "Actief",
            followup: "Follow-up",
            wachten: "Wachten",
            vip: "VIP",
            afgerond: "Afgerond"
        };

        return labels[status] || "Onbekend";
    }

    function setClientFeedback(message) {
        if (clientFeedback) {
            clientFeedback.textContent = message;
        }
    }

    function setFormMode(customer) {
        const isEditing = Boolean(customer);

        if (clientFormTitle) {
            clientFormTitle.textContent = isEditing ? "Klant bewerken" : "Nieuwe klant";
        }

        if (clientFormState) {
            clientFormState.textContent = isEditing ? "Bestaand profiel" : "Nieuw profiel";
        }

        if (clientSubmitButton) {
            clientSubmitButton.textContent = isEditing ? "Wijzigingen opslaan" : "Klant opslaan";
        }

        if (clientResetButton) {
            clientResetButton.textContent = isEditing ? "Bewerken annuleren" : "Formulier leegmaken";
        }
    }

    function resetClientForm() {
        if (!clientForm) {
            return;
        }

        clientForm.reset();

        if (clientForm.elements.id) {
            clientForm.elements.id.value = "";
        }

        if (clientForm.elements.channel) {
            clientForm.elements.channel.value = "WhatsApp";
        }

        if (clientForm.elements.status) {
            clientForm.elements.status.value = "nieuw";
        }

        if (clientForm.elements.priority) {
            clientForm.elements.priority.value = "Normaal";
        }

        setFormMode(null);
    }

    function getVisibleCustomers() {
        const searchQuery = normaliseClientText(clientSearch ? clientSearch.value : "");
        const statusValue = clientFilterStatus ? clientFilterStatus.value : "all";
        const sortValue = clientSort ? clientSort.value : "updated";

        return clientState.customers
            .filter((customer) => {
                if (statusValue !== "all" && customer.status !== statusValue) {
                    return false;
                }

                if (!searchQuery) {
                    return true;
                }

                const searchableText = [
                    customer.name,
                    customer.contact,
                    customer.channel,
                    customer.packageName,
                    customer.notes,
                    customer.priority
                ].join(" ");

                return normaliseClientText(searchableText).includes(searchQuery);
            })
            .sort((firstCustomer, secondCustomer) => {
                if (sortValue === "name") {
                    return normaliseClientText(firstCustomer.name).localeCompare(normaliseClientText(secondCustomer.name), "nl");
                }

                if (sortValue === "amount") {
                    return (secondCustomer.amount || 0) - (firstCustomer.amount || 0);
                }

                if (sortValue === "followup") {
                    const firstDate = firstCustomer.nextFollowUp || "9999-12-31";
                    const secondDate = secondCustomer.nextFollowUp || "9999-12-31";

                    return firstDate.localeCompare(secondDate);
                }

                const firstUpdated = firstCustomer.updatedAt || firstCustomer.createdAt || "";
                const secondUpdated = secondCustomer.updatedAt || secondCustomer.createdAt || "";

                return secondUpdated.localeCompare(firstUpdated);
            });
    }

    function renderClientStats() {
        const todayKey = getTodayKey();
        const totalCustomers = clientState.customers.length;
        const activeCustomers = clientState.customers.filter((customer) => ["nieuw", "actief", "vip"].includes(customer.status)).length;
        const followUpCustomers = clientState.customers.filter((customer) => customer.status !== "afgerond" && customer.nextFollowUp && customer.nextFollowUp <= todayKey).length;
        const totalRevenue = clientState.customers.reduce((sum, customer) => sum + (customer.amount || 0), 0);

        if (clientStats.total) {
            clientStats.total.textContent = String(totalCustomers);
        }

        if (clientStats.active) {
            clientStats.active.textContent = String(activeCustomers);
        }

        if (clientStats.followup) {
            clientStats.followup.textContent = String(followUpCustomers);
        }

        if (clientStats.revenue) {
            clientStats.revenue.textContent = formatClientAmount(totalRevenue);
        }
    }

    function renderClientList() {
        if (!clientList || !clientResults || !clientEmpty) {
            return;
        }

        const visibleCustomers = getVisibleCustomers();
        const todayKey = getTodayKey();

        clientResults.textContent = `${visibleCustomers.length} klant${visibleCustomers.length === 1 ? "" : "en"} zichtbaar`;
        clientList.innerHTML = visibleCustomers.map((customer) => {
            const notesText = customer.notes ? escapeClientHtml(customer.notes) : "Geen notities toegevoegd.";
            const followUpClass = customer.nextFollowUp && customer.nextFollowUp < todayKey ? " is-overdue" : "";

            return `
                <article class="client-card">
                    <div class="client-card-head">
                        <div>
                            <h3 class="client-card-title">${escapeClientHtml(customer.name)}</h3>
                            <p class="client-card-subtitle">${escapeClientHtml(customer.contact)} · ${escapeClientHtml(customer.channel || "Onbekend kanaal")}</p>
                        </div>

                        <div class="client-card-tags">
                            <span class="client-status-badge status-${escapeClientHtml(customer.status || "nieuw")}">${escapeClientHtml(getStatusLabel(customer.status))}</span>
                            <span class="client-priority-badge priority-${escapeClientHtml(customer.priority || "Normaal")}">${escapeClientHtml(customer.priority || "Normaal")}</span>
                        </div>
                    </div>

                    <div class="client-card-grid">
                        <div class="client-detail">
                            <span class="client-detail-label">Pakket</span>
                            <span class="client-detail-value">${escapeClientHtml(customer.packageName || "Niet ingevuld")}</span>
                        </div>

                        <div class="client-detail">
                            <span class="client-detail-label">Omzet</span>
                            <span class="client-detail-value">${escapeClientHtml(formatClientAmount(customer.amount))}</span>
                        </div>

                        <div class="client-detail">
                            <span class="client-detail-label">Volgende contactdatum</span>
                            <span class="client-detail-value${followUpClass}">${escapeClientHtml(formatClientDate(customer.nextFollowUp))}</span>
                        </div>

                        <div class="client-detail">
                            <span class="client-detail-label">Laatst gewijzigd</span>
                            <span class="client-detail-value">${escapeClientHtml(formatClientDate((customer.updatedAt || customer.createdAt || "").slice(0, 10)))}</span>
                        </div>
                    </div>

                    <p class="client-card-notes">${notesText}</p>

                    <div class="client-card-actions">
                        <button class="client-action-button is-primary" type="button" data-client-action="edit" data-client-id="${escapeClientHtml(customer.id)}">Bewerken</button>
                        <button class="client-action-button is-danger" type="button" data-client-action="delete" data-client-id="${escapeClientHtml(customer.id)}">Verwijderen</button>
                    </div>
                </article>
            `;
        }).join("");

        clientEmpty.hidden = visibleCustomers.length !== 0;
        renderClientStats();
    }

    function populateClientForm(customer) {
        if (!clientForm) {
            return;
        }

        clientForm.elements.id.value = customer.id || "";
        clientForm.elements.name.value = customer.name || "";
        clientForm.elements.contact.value = customer.contact || "";
        clientForm.elements.channel.value = customer.channel || "WhatsApp";
        clientForm.elements.status.value = customer.status || "nieuw";
        clientForm.elements.packageName.value = customer.packageName || "";
        clientForm.elements.nextFollowUp.value = customer.nextFollowUp || "";
        clientForm.elements.amount.value = typeof customer.amount === "number" ? String(customer.amount) : "";
        clientForm.elements.priority.value = customer.priority || "Normaal";
        clientForm.elements.notes.value = customer.notes || "";

        setFormMode(customer);
        setClientFeedback(`${customer.name} staat nu klaar om te bewerken.`);
        clientForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function upsertCustomer(event) {
        event.preventDefault();

        if (!clientForm) {
            return;
        }

        const formData = new FormData(clientForm);
        const customerId = String(formData.get("id") || "").trim();
        const amountValue = String(formData.get("amount") || "").replace(",", ".").trim();
        const parsedAmount = amountValue ? Number(amountValue) : null;

        if (amountValue && Number.isNaN(parsedAmount)) {
            setClientFeedback("Vul een geldig bedrag in voor omzet.");
            return;
        }

        const customerRecord = {
            id: customerId || createClientId(),
            name: String(formData.get("name") || "").trim(),
            contact: String(formData.get("contact") || "").trim(),
            channel: String(formData.get("channel") || "").trim(),
            status: String(formData.get("status") || "nieuw").trim(),
            packageName: String(formData.get("packageName") || "").trim(),
            nextFollowUp: String(formData.get("nextFollowUp") || "").trim(),
            amount: typeof parsedAmount === "number" && !Number.isNaN(parsedAmount) ? parsedAmount : null,
            priority: String(formData.get("priority") || "Normaal").trim(),
            notes: String(formData.get("notes") || "").trim(),
            updatedAt: new Date().toISOString()
        };

        if (!customerRecord.name || !customerRecord.contact) {
            setClientFeedback("Vul minstens naam en contact in.");
            return;
        }

        const existingIndex = clientState.customers.findIndex((customer) => customer.id === customerRecord.id);

        if (existingIndex >= 0) {
            const existingCustomer = clientState.customers[existingIndex];

            clientState.customers[existingIndex] = {
                ...existingCustomer,
                ...customerRecord,
                createdAt: existingCustomer.createdAt || existingCustomer.updatedAt || customerRecord.updatedAt
            };
        } else {
            clientState.customers.unshift({
                ...customerRecord,
                createdAt: customerRecord.updatedAt
            });
        }

        saveCustomers();
        renderClientList();
        resetClientForm();
        setClientFeedback(`${customerRecord.name} is opgeslagen.`);
    }

    function deleteCustomer(customerId) {
        const customer = clientState.customers.find((item) => item.id === customerId);

        if (!customer) {
            return;
        }

        const shouldDelete = window.confirm(`Weet je zeker dat je ${customer.name} wilt verwijderen?`);

        if (!shouldDelete) {
            return;
        }

        clientState.customers = clientState.customers.filter((item) => item.id !== customerId);
        saveCustomers();
        renderClientList();

        if (clientForm && clientForm.elements.id && clientForm.elements.id.value === customerId) {
            resetClientForm();
        }

        setClientFeedback(`${customer.name} is verwijderd.`);
    }

    function exportCustomers() {
        const visibleCustomers = getVisibleCustomers();

        if (!visibleCustomers.length) {
            setClientFeedback("Er zijn geen klanten om te kopieren.");
            return;
        }

        const exportText = visibleCustomers.map((customer, index) => {
            const parts = [
                `${index + 1}. ${customer.name}`,
                `status: ${getStatusLabel(customer.status)}`,
                `kanaal: ${customer.channel || "-"}`,
                `pakket: ${customer.packageName || "-"}`,
                `contact: ${customer.contact || "-"}`,
                `follow-up: ${customer.nextFollowUp ? formatClientDate(customer.nextFollowUp) : "-"}`,
                `omzet: ${formatClientAmount(customer.amount)}`
            ];

            return parts.join(" | ");
        }).join("\n");

        navigator.clipboard.writeText(exportText).then(() => {
            setClientFeedback("Het zichtbare klantenoverzicht is gekopieerd.");
        }).catch(() => {
            setClientFeedback("Kopieren lukte niet in deze browser.");
        });
    }

    if (clientForm) {
        clientForm.addEventListener("submit", upsertCustomer);
    }

    if (clientResetButton) {
        clientResetButton.addEventListener("click", () => {
            resetClientForm();
            setClientFeedback("Het formulier is weer leeg.");
        });
    }

    if (clientSearch) {
        clientSearch.addEventListener("input", renderClientList);
    }

    if (clientFilterStatus) {
        clientFilterStatus.addEventListener("change", renderClientList);
    }

    if (clientSort) {
        clientSort.addEventListener("change", renderClientList);
    }

    if (clientList) {
        clientList.addEventListener("click", (event) => {
            const button = event.target.closest("[data-client-action]");

            if (!button) {
                return;
            }

            const { clientAction, clientId } = button.dataset;
            const selectedCustomer = clientState.customers.find((customer) => customer.id === clientId);

            if (clientAction === "edit" && selectedCustomer) {
                populateClientForm(selectedCustomer);
            }

            if (clientAction === "delete" && clientId) {
                deleteCustomer(clientId);
            }
        });
    }

    if (clientExportButton) {
        clientExportButton.addEventListener("click", exportCustomers);
    }

    resetClientForm();
    renderClientList();
}
