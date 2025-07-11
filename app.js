window.onload = function () {
  const state = {
    includeCover: true,
    background: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "John",
    lastname: "Doe",
    role: "Web Developer",
    location: "CDMX, México"
  };

  const renderProfile = () => {
    const cover = state.includeCover
      ? `<div class="cover"><img src="${state.background}" alt="cover image" style="width:100%; border-radius: 1rem 1rem 0 0;" /></div>`
      : "";

    document.querySelector("#profile-card").innerHTML = `
      ${cover}
      <img src="${state.avatar}" alt="avatar" style="width: 100px; border-radius: 50%; margin-top: 1rem;" />
      <h2 style="margin-top: 1rem;">${state.name} ${state.lastname}</h2>
      <h4 style="color: #aaa;">${state.role}</h4>
      <p style="margin-top: 0.5rem; font-size: 0.9rem;">📍 ${state.location}</p>
    `;
  };

  // Elementos del DOM
  const includeCoverSelect = document.getElementById("includeCover");
  const inputs = {
    background: document.getElementById("background"),
    avatar: document.getElementById("avatar"),
    name: document.getElementById("name"),
    lastname: document.getElementById("lastname"),
    role: document.getElementById("role"),
    location: document.getElementById("location")
  };

  // Listeners
  includeCoverSelect.addEventListener("change", (e) => {
    state.includeCover = e.target.value === "true";
    renderProfile();
  });

  for (let key in inputs) {
    inputs[key].addEventListener("input", (e) => {
      state[key] = e.target.value;
      renderProfile();
    });
  }

  renderProfile(); // render inicial
};
