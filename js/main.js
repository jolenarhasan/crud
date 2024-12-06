const name = document.querySelector("#productName");
const price = document.querySelector("#productPrice");
const category = document.querySelector("#productCategory");
const description = document.querySelector("#productDescription");
const addbtn = document.querySelector("#click");
const invalidName = document.querySelector(".invalidName");
const invalidCategory = document.querySelector(".invalidCategory");
const invalidPrice = document.querySelector(".invalidPrice");
const invalidDescription = document.querySelector(".invalidDescription");
const deleteAll = document.querySelector("#deleteBtn");
const search = document.querySelector("#search");
const clearBtn = document.querySelector("#clear");

let products = [];
if (localStorage.getItem("products") != null) {
  products = JSON.parse(localStorage.getItem("products"));
  dispalyPrpducts();
}
addbtn.addEventListener("click", (e) => {
  e.preventDefault();
  let isValid = true;
  const namepattern = /^[A-Z][a-z]{3,8}$/;
  const categoryPattern = /^[A-Z][a-z]{2,10}$/;
  const pricePattern = /^\d{1,3}(\.\d{1,3})?$/;
  const descriptionPattern = /^.{10,100}$/;

  if (!namepattern.test(name.value)) {
    invalidName.innerHTML =
      "name must have a capital letter and 3-8 lowercase letters";
    name.classList.add("is-invalid");
    isValid = false;
  } else {
    invalidName.innerHTML = "";
    name.classList.remove("is-invalid");
    name.classList.add("is-valid");
  }
  if (!categoryPattern.test(name.value)) {
    invalidCategory.innerHTML =
      "category must have a capital letter and 2-10 lowercase letters";
    category.classList.add("is-invalid");
    isValid = false;
  } else {
    invalidCategory.innerHTML = "";
    category.classList.remove("is-invalid");
    category.classList.add("is-valid");
  }

  if (!pricePattern.test(price.value)) {
    invalidPrice.innerHTML =
      "Price must be a valid number (up to 3 digits, optionally with 3 decimal places).";
    price.classList.add("is-invalid");
    isValid = false;
  } else {
    invalidPrice.innerHTML = "";
    price.classList.remove("is-invalid");
    price.classList.add("is-valid");
  }

  if (!descriptionPattern.test(description.value)) {
    invalidDescription.innerHTML =
      "Description must be between 10 and 100 characters.";
    description.classList.add("is-invalid");
    isValid = false;
  } else {
    invalidDescription.innerHTML = "";
    description.classList.remove("is-invalid");
    description.classList.add("is-valid");
  }

  if (isValid == true) {
    const newProduct = {
      name: name.value,
      price: price.value,
      category: category.value,
      description: description.value,
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "product added successfully!",
    });

    dispalyPrpducts();
    name.value = "";
    price.value = "";
    category.value = "";
    description.value = "";
  }
});
function dispalyPrpducts() {
  const result = products
    .map((product, index) => {
      return `
        <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td><button onclick="deleteProduct(${index})" class="btn btn-danger">Delete</button></td>
        
        </tr>
        `;
    })
    .join("  ");
  document.querySelector("#data").innerHTML = result;
}
function deleteProduct(index) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        dispalyPrpducts();
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
}
deleteAll.addEventListener("click", () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        products = [];
        localStorage.setItem("products", JSON.stringify(products));
        dispalyPrpducts();
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
});
search.addEventListener("input", () => {
  const searchText = search.value;
  const res = products.filter((product) => {
    return product.name.toLowerCase().includes(searchText.toLowerCase());
  });
  const productResult = res
    .map((product, index) => {
      return `
            <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td><button onclick="deleteProduct(${index})" class="btn btn-danger">Delete</button></td>
            
            </tr>
            `;
    })
    .join("  ");
  document.querySelector("#data").innerHTML = productResult;
});
clearBtn.addEventListener("click", () => {
  document.querySelectorAll(".inputs").forEach((input) => {
    input.value = "";
    input.classList.remove("is-valid", "is-invalid");
  });
});
