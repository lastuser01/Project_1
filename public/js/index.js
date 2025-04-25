document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  // Initialize theme
  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      setTheme(prefersDark.matches ? "dark" : "light");
    }
  }

  // Set theme
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }

  // System theme change listener
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

  // Button click listener
  toggle.addEventListener("click", toggleTheme);

  // Initialize
  initTheme();
});

let taxswitch = document.getElementById("switchCheckReverse");
let show = false;
taxswitch.addEventListener("click", () => {
  if (show == false) {
    let taxes = document.querySelectorAll(".tax");
    for (tax of taxes) {
      tax.style.display = "block";
    }
    show = true;
  } else {
    let taxes = document.querySelectorAll(".tax");
    for (tax of taxes) {
      tax.style.display = "none";
    }
    show = false;
  }
});

let categories = new Set();
let fetched_Listings;

document.querySelectorAll(".filter").forEach((value) => {
  value.addEventListener("click", () => {
    let category = value.getAttribute("category");
    if (categories.has(category)) {
      categories.delete(category);
      value.classList.remove("selected");
    } else {
      categories.add(category);
      value.classList.add("selected");
    }
    fetchlistings();
  });
});

async function fetchlistings() {
  showLoading(true);
  const selectedCategories = [...categories];
  try {
    const response = await fetch("/listings/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categories: selectedCategories }),
    });

    const data = await response.json();

    if (data.success) {
      updatelistings(data.items);
      console.log(data.items);
    } else {
      window.location.replace("/listings");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    showLoading(false);
  }
}

function updatelistings(data) {
  let container = document.querySelector(".innercontainer");

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  data.forEach((listing) => {
    const listingElement = document.createElement("div");
    listingElement.innerHTML = `
  <a href="/listings/${listing._id}" class="cards">
    <div class="col card all" style="width: 21rem">
      <img
        class="card-img-top mx-auto d-block"
        src="${listing.image.url}"
        alt="${listing.title}"
        style="
          width: 24rem;
          height: 40vh;
          object-fit: cover;
          border-radius: 20px;
        "
      />
      <div class="card-body">
        <div class="card-text">
          <b class="fw-medium">${listing.title}</b>
          <br />
          &#8377; ${listing.price} / night &nbsp;<i class="tax">+18%GST</i>
        </div>
      </div>
    </div>
  </a>
`;

    fragment.appendChild(listingElement.firstElementChild);
  });
  container.appendChild(fragment);
}

function showLoading(show) {
  const spinner = document.querySelector(".loading-spinner");
  if (spinner) {
    spinner.style.display = show ? "flex" : "none";
  }
}
