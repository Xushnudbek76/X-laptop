console.log("Products frontend javascript file");

$(function () {
  // Toggle new laptop form
  $("#add-btn").on("click", () => {
    $("#laptop-form").slideDown(400);
    $("#add-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $("#laptop-form").slideUp(300);
    $("#add-btn").css("display", "flex");
  });

  // Update laptop status
  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id;
    const laptopStatus = $(`#${id}`).val();

    try {
      const response = await axios.post(`/admin/item/update`, {
        _id: id,
        laptopStatus: laptopStatus,
      });
      const result = response.data;
      if (result.data) {
        $(".new-product-status").blur();
      } else {
        alert("Laptop update failed!");
      }
    } catch (error) {
      console.log(error);
      alert("Laptop update failed!");
    }
  });
});

function validateForm() {
  const laptopName = $(".laptop-name").val(),
    laptopPrice = $(".laptop-price").val(),
    laptopLeftCount = $(".laptop-left-count").val(),
    laptopCpu = $(".laptop-cpu").val(),
    laptopDisplaySize = $(".laptop-display-size").val();

  if (
    laptopName === "" ||
    laptopPrice === "" ||
    laptopLeftCount === "" ||
    laptopCpu === "" ||
    laptopDisplaySize === ""
  ) {
    alert("Please insert all required inputs!");
    return false;
  }
}

function previewFileHandler(input, order) {
  const imgClassName = input.className;
  const file = $(`.${imgClassName}`).get(0).files[0];

  const fileType = file["type"];
  const validImageType = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImageType.includes(fileType)) {
    alert("Please insert only jpeg, jpg and png!");
  } else {
    if (!file) return false;
    const reader = new FileReader();
    reader.onload = function () {
      $(`#image-section-${order}`).attr("src", reader.result);
      $(`.upload-box:eq(${order - 1}) .upload-icon`).hide();
    };
    reader.readAsDataURL(file);
  }
}
