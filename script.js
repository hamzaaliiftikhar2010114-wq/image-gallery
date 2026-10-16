
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");
const searchInput = document.querySelector("#search-input");
const photoCount = document.querySelector("#photo-count");
const emptyMessage = document.querySelector("#empty-message");
const sortSelect = document.querySelector("#sort-select");
const gallery = document.querySelector("#gallery");

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeLightbox = document.querySelector("#lightbox-close");
const previousButton = document.querySelector("#lightbox-prev");
const nextButton = document.querySelector("#lightbox-next");

let activeCategory = "all";
let currentPhotoIndex = 0;

const originalOrder = Array.from(galleryItems);

function sortGallery() {
    const items = Array.from(originalOrder);

    if (sortSelect.value === "az") {
        items.sort(function (a, b) {
            return a.dataset.title.localeCompare(b.dataset.title);
        });
    } else if (sortSelect.value === "za") {
        items.sort(function (a, b) {
            return b.dataset.title.localeCompare(a.dataset.title);
        });
    }

    items.forEach(function (item) {
        gallery.appendChild(item);
    });
}

function filterGallery() {
    const searchText = searchInput.value.toLowerCase().trim();
    let visiblePhotos = 0;

    galleryItems.forEach(function (item) {
        const category = item.dataset.category;
        const title = item.dataset.title.toLowerCase();

        const matchesCategory =
            activeCategory === "all" || category === activeCategory;

        const matchesSearch = title.includes(searchText);

        if (matchesCategory && matchesSearch) {
            item.style.display = "";
            visiblePhotos++;
        } else {
            item.style.display = "none";
        }
    });

    photoCount.textContent =
        visiblePhotos + (visiblePhotos === 1 ? " photograph" : " photographs");

    emptyMessage.hidden = visiblePhotos !== 0;
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        activeCategory = button.dataset.category;
        filterGallery();
    });
});

searchInput.addEventListener("input", filterGallery);

sortSelect.addEventListener("change", function () {
    sortGallery();
    filterGallery();
});

function getVisiblePhotos() {
    return Array.from(galleryItems).filter(function (item) {
        return item.style.display !== "none";
    });
}

function showPhoto(index) {
    const visiblePhotos = getVisiblePhotos();

    if (visiblePhotos.length === 0) {
        return;
    }

    currentPhotoIndex =
        (index + visiblePhotos.length) % visiblePhotos.length;

    const photo = visiblePhotos[currentPhotoIndex];
    const image = photo.querySelector("img");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = photo.dataset.title;
}

function openLightbox(item) {
    const visiblePhotos = getVisiblePhotos();
    currentPhotoIndex = visiblePhotos.indexOf(item);

    showPhoto(currentPhotoIndex);
    lightbox.showModal();
}

galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
        openLightbox(item);
    });
});

closeLightbox.addEventListener("click", function () {
    lightbox.close();
});

previousButton.addEventListener("click", function () {
    showPhoto(currentPhotoIndex - 1);
});

nextButton.addEventListener("click", function () {
    showPhoto(currentPhotoIndex + 1);
});

document.addEventListener("keydown", function (event) {
    if (!lightbox.open) {
        return;
    }

    if (event.key === "ArrowLeft") {
        showPhoto(currentPhotoIndex - 1);
    }

    if (event.key === "ArrowRight") {
        showPhoto(currentPhotoIndex + 1);
    }
});

filterGallery();
