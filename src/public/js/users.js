console.log("Users frontend javascript file");

$(function () {
  $(".member-status").on("change", function (e) {
    const id = e.target.id,
      memberStatus = $(`#${id}.member-status`).val();

    axios
      .post("/admin/user/update", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        const result = response.data;
        if (result.data) {
          $(".member-status").blur();
        } else {
          alert("User update failed!");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("User update failed!");
      });
  });
});
