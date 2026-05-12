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
