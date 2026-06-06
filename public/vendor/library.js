function OpenMenuMb() {
  $(".wp-menu-mb-js").addClass("open-menu-mb");
  $(".bg-menu-js").addClass("active");
  $("html,body").addClass("overflow-body");
}

function RemoveMenuMb() {
  $(".wp-menu-mb-js").removeClass("open-menu-mb");
  $(".bg-menu-js").removeClass("active");
  $("html,body").removeClass("overflow-body");
}
$(document).ready(function () {
  $(document).off("click.iconDotsRow", ".icon-dots-row");
  $(document).on("click.iconDotsRow", ".icon-dots-row", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const $boxPopupMain = $(this).siblings(".box-popup-action-imt");
    const $parentBox = $(this).closest(".imt-action-crm");
    const $boxPopupAll = $(".box-popup-action-imt");
    const boxPopupEle = $boxPopupAll[0];

    if (boxPopupEle) {
      $boxPopupAll.css({
        opacity: "0",
        display: "block",
        visibility: "hidden",
        position: "fixed",
      });
      $(".box-popup-action-imt").removeClass("open-box");
    }
    if ($boxPopupMain.css("visibility") === "visible") {
      $boxPopupMain.css({
        visibility: "hidden",
        opacity: "0",
      });
      $boxPopupMain.removeClass("open-box");
      return;
    }
    $boxPopupMain.toggleClass("open-box");
    const btnDots = this;
    const boxPopupMain = $boxPopupMain[0];
    const eleParentArray = $(this).parents().toArray();
    const eleParentOverflow = [this].concat(eleParentArray);
    const sliceView =
      eleParentOverflow.find(function (el) {
        const $el = $(el);
        const overflow = $el.css("overflow");
        const overflowX = $el.css("overflow-x");
        const overflowY = $el.css("overflow-y");

        return (
          (overflow && overflow !== "visible") ||
          (overflowX && overflowX !== "visible") ||
          (overflowY && overflowY !== "visible")
        );
      }) || document.body;
    if (!boxPopupMain || !sliceView) {
      $boxPopupMain.css({
        display: "block",
        visibility: "visible",
        opacity: "1",
      });
    } else {
      $boxPopupMain.css({
        display: "block",
        opacity: "0",
        visibility: "hidden",
        position: "fixed",
      });

      const slicePos = sliceView.getBoundingClientRect();
      const boxPopupMainPos = boxPopupMain.getBoundingClientRect();
      const btnDotsPos = btnDots.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const GAP = 10;
      const offsetParent = boxPopupMain.offsetParent;

      let parentLeft = 0;
      let parentTop = 0;
      let positionAbove = btnDotsPos.top - boxPopupMainPos.height - GAP;
      let positionBelow = btnDotsPos.bottom + GAP;
      if (offsetParent) {
        const parentPos = offsetParent.getBoundingClientRect();
        parentLeft = parentPos.left;
        parentTop = parentPos.top;
      }

      let newLeft = btnDotsPos.left - boxPopupMainPos.width + 30;
      let newTop = positionBelow;

      if (newTop < 0) {
        newTop = positionBelow;
      }
      if (newTop + boxPopupMainPos.height > windowHeight) {
        newTop = positionAbove;
      }

      newLeft = newLeft - parentLeft;
      newTop = newTop - parentTop;
      $boxPopupMain.css({
        top: newTop + "px",
        left: newLeft + "px",
        visibility: "visible",
        opacity: "1",
        zIndex: "3",
      });
    }
  });

  $(document).off("click.actionPopup", ".box-popup-action-imt");
  $(document).on("click.actionPopup", ".box-popup-action-imt", function (e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
  $(document).on("click", function (e) {
    $(".box-popup-action-imt").removeClass("open-box").css({
      visibility: "hidden",
      opacity: "0",
    });
  });
  $(".group-table-web, .box-table-2025, window, html").on(
    "scroll",
    function () {
      const $popupsOpen = $(".box-popup-action-imt.open-box");
      if ($popupsOpen.length > 0) {
        $popupsOpen.css({
          visibility: "hidden",
          opacity: "0",
          display: "none",
        });
        $(".box-popup-action-imt").removeClass("open-box");
      }
    },
  );
  //   function normalizeChatText($el) {
  //   let text = $el.text();

  //   // bỏ dòng trống đầu & cuối do HTML format
  //   text = text.replace(/^\n+|\n+$/g, "");

  //   // tách thành từng dòng
  //   let lines = text.split("\n");

  //   // tìm indent chung nhỏ nhất
  //   let minIndent = Infinity;

  //   $.each(lines, function (_, line) {
  //     if ($.trim(line) === "") return;

  //     const match = line.match(/^(\s+)/);
  //     if (match) {
  //       minIndent = Math.min(minIndent, match[1].length);
  //     } else {
  //       minIndent = 0;
  //     }
  //   });

  //   // cắt indent chung
  //   if (minIndent !== Infinity && minIndent > 0) {
  //     lines = $.map(lines, function (line) {
  //       return line.slice(minIndent);
  //     });
  //   }

  //   // gán lại text sạch
  //   $el.text(lines.join("\n"));
  // }

  $(document).ready(function () {
    $(".txt-chat-message").each(function () {
      normalizeChatText($(this));
    });
  });

  // $("*")
  //   .contents()
  //   .filter(function () {
  //     // Node type 3 là text node (văn bản thuần túy)
  //     return this.nodeType === 3;
  //   })
  //   .each(function () {
  //     // Trim trực tiếp giá trị của text node
  //     this.nodeValue = this.nodeValue.trim();
  //   });
  const $contentTable = $(".content-table");
  const $titleTable = $(".imt-title-table");
  if ($contentTable.children().length == 0) {
    $titleTable.css({
      "min-width": "auto",
      "max-width": "none",
    });
  }
  $("#chats").click(function (e) {
    e.preventDefault();
    $(this).closest(".box-tree-chat--item").toggleClass("open-chat-child");
  });
  $("#btn-mention-box").click(function (e) {
    e.preventDefault();
    $(".main-mention-user").toggleClass("open-box");
  });
  $(".box-search-topbar").click(function () {
    $(".box-popup-search-full").addClass("open-popup");
    $("html,body").addClass("overflow-hidden");
  });
  $(".bg-popup-page").click(function () {
    $(".box-popup-search-full").removeClass("open-popup");
    $("html,body").removeClass("overflow-hidden");
  });
  $(".wth-tooltip")
    .on("mouseenter", function () {
      const $tooltip = $(this).find(".topbar-tooltip");

      const tooltipEle = $tooltip[0];
      const eleParentArray = $(this).parents().toArray();
      const eleParentOverflow = [this].concat(eleParentArray);
      const eleWthTool = this;
      const sliceView =
        eleParentOverflow.find(function (el) {
          const $el = $(el);
          const overflow = $el.css("overflow");
          const overflowX = $el.css("overflow-x");
          const overflowY = $el.css("overflow-y");
          console.log($el);
          return (
            (overflow && overflow !== "visible") ||
            (overflowX && overflowX !== "visible") ||
            (overflowY && overflowY !== "visible")
          );
        }) || document.body;

      if (!tooltipEle || !sliceView) {
        $tooltip.css({
          visibility: "visible",
          opacity: "1",
          display: "block",
        });
      } else {
        $tooltip.css({
          display: "block",
          visibility: "hidden",
          opacity: "0",
          position: "fixed",
        });
        const _forceReflow = tooltipEle.offsetHeight;

        const toolTipPos = tooltipEle.getBoundingClientRect();
        const slicePos = sliceView.getBoundingClientRect();
        const eleWthToolPos = eleWthTool.getBoundingClientRect();

        const offsetParent = tooltipEle.offsetParent;
        let parentLeft = 0;
        let parentTop = 0;
        if (offsetParent) {
          const parentPos = offsetParent.getBoundingClientRect();
          parentLeft = parentPos.left;
          parentTop = parentPos.top;
        }

        let newLeft = eleWthToolPos.left;
        let newTop = eleWthToolPos.top - toolTipPos.height - 5;

        if (newLeft + toolTipPos.width > slicePos.right) {
          newLeft = eleWthToolPos.right - toolTipPos.width;
        }
        newLeft = newLeft - parentLeft;
        newTop = newTop - parentTop;
        $tooltip.css({
          left: newLeft + "px",
          top: newTop + "px",
          visibility: "visible",
          opacity: "1",
          // position: "fixed",
        });
      }
    })
    .on("mouseleave", function () {
      const $tooltip = $(this).find(".topbar-tooltip");

      if ($tooltip) {
        $tooltip.css({
          visibility: "hidden",
          opacity: "0",
          // display: "none",
        });
      }
    });

  // $(".btn-nv-dhs")
  //   .on("mouseenter", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");
  //     const tooltipEle = $tooltip[0];
  //     const tableElement = $(this).closest(".group-table-web")[0];
  //     const btnElement = this;
  //     if (!tooltipEle || !tableElement) {
  //       $tooltip.css({
  //         visibility: "visible",
  //         opacity: "1",
  //         display: "block",
  //       });
  //     } else {
  //       $tooltip.css({
  //         display: "block",
  //         visibility: "hidden",
  //         opacity: "0",
  //       });
  //       const toolTipPos = tooltipEle.getBoundingClientRect();
  //       const tablePos = tableElement.getBoundingClientRect();
  //       const btnPos = btnElement.getBoundingClientRect();
  //       let newLeft = btnPos.left;
  //       let newTop = btnPos.top - btnPos.height - 5;

  //       if (newLeft + toolTipPos.width > tablePos.right) {
  //         newLeft = btnPos.right - toolTipPos.width;
  //       }

  //       $tooltip.css({
  //         left: newLeft + "px",
  //         top: newTop + "px",
  //         visibility: "visible",
  //         opacity: "1",
  //         position: "fixed",
  //       });
  //     }
  //   })
  //   .on("mouseleave", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");

  //     if ($tooltip) {
  //       $tooltip.css({
  //         visibility: "hidden",
  //         opacity: "0",
  //         // display: "none",
  //       });
  //     }
  //   });

  // $(".btn-frame-colors")
  //   .on("mouseenter", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");
  //     const tooltipEle = $tooltip[0];
  //     const sliceView = $(this).closest(".block-main-chat")[0];
  //     const btnElement = this;
  //     if (!tooltipEle || !sliceView) {
  //       $tooltip.css({
  //         visibility: "visible",
  //         opacity: "1",
  //         display: "block",
  //       });
  //     } else {
  //       $tooltip.css({
  //         display: "block",
  //         visibility: "hidden",
  //         opacity: "0",
  //       });
  //       const toolTipPos = tooltipEle.getBoundingClientRect();
  //       const slicePos = sliceView.getBoundingClientRect();
  //       const btnPos = btnElement.getBoundingClientRect();
  //       let newLeft = btnPos.left;
  //       let newTop = btnPos.top - btnPos.height - 5;

  //       if (newLeft + toolTipPos.width > slicePos.right) {
  //         newLeft = btnPos.right - toolTipPos.width;
  //       }

  //       $tooltip.css({
  //         left: newLeft + "px",
  //         top: newTop + "px",
  //         visibility: "visible",
  //         opacity: "1",
  //         position: "fixed",
  //       });
  //     }
  //   })
  //   .on("mouseleave", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");

  //     if ($tooltip) {
  //       $tooltip.css({
  //         visibility: "hidden",
  //         opacity: "0",
  //         // display: "none",
  //       });
  //     }
  //   });
  // $(".icon-item-utilitys")
  //   .on("mouseenter", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");
  //     const tooltipEle = $tooltip[0];
  //     const sliceView = $(this).closest(".block-main-chat")[0];
  //     const btnElement = this;
  //     if (!tooltipEle || !sliceView) {
  //       $tooltip.css({
  //         visibility: "visible",
  //         opacity: "1",
  //         display: "block",
  //       });
  //     } else {
  //       $tooltip.css({
  //         display: "block",
  //         visibility: "hidden",
  //         opacity: "0",
  //       });
  //       const toolTipPos = tooltipEle.getBoundingClientRect();
  //       const slicePos = sliceView.getBoundingClientRect();
  //       const btnPos = btnElement.getBoundingClientRect();
  //       let newLeft = btnPos.left;
  //       let newTop = btnPos.top - btnPos.height - 5;

  //       if (newLeft + toolTipPos.width > slicePos.right) {
  //         newLeft = btnPos.right - toolTipPos.width;
  //       }

  //       $tooltip.css({
  //         left: newLeft + "px",
  //         top: newTop + "px",
  //         visibility: "visible",
  //         opacity: "1",
  //         position: "fixed",
  //       });
  //     }
  //   })
  //   .on("mouseleave", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");

  //     if ($tooltip) {
  //       $tooltip.css({
  //         visibility: "hidden",
  //         opacity: "0",
  //         // display: "none",
  //       });
  //     }
  //   });

  // $(".icon-item-utilitys,.btn-square-layouts")
  //   .on("mouseenter", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");
  //     const tooltipEle = $tooltip[0];
  //     const sliceElement = $(this).closest(".main-layout-site")[0];
  //     const btnElement = this;
  //     if (!tooltipEle || !sliceElement) {
  //       $tooltip.css({
  //         visibility: "visible",
  //         opacity: "1",
  //         display: "block",
  //       });
  //     } else {
  //       $tooltip.css({
  //         display: "block",
  //         visibility: "hidden",
  //         opacity: "0",
  //       });
  //       const toolTipPos = tooltipEle.getBoundingClientRect();
  //       const slicePos = sliceElement.getBoundingClientRect();
  //       const btnPos = btnElement.getBoundingClientRect();
  //       let newTop = btnPos.top - btnPos.height - 5;
  //       let newLeft = btnPos.left;

  //       if (newTop < slicePos.top) {
  //         newTop = btnPos.top - btnPos.height;
  //       }

  //       $tooltip.css({
  //         left: newLeft + "px",
  //         top: newTop + "px",
  //         visibility: "visible",
  //         opacity: "1",
  //         position: "fixed",
  //       });
  //     }
  //   })
  //   .on("mouseleave", function () {
  //     const $tooltip = $(this).find(".topbar-tooltip");

  //     if ($tooltip) {
  //       $tooltip.css({
  //         visibility: "hidden",
  //         opacity: "0",
  //         // display: "none",
  //       });
  //     }
  //   });
  $('[data-toggle="tooltip"]').tooltip();
  // Click mở popup
  $(".topbar-sidebar-collapse .icon-collapse").click(function () {
    var w = window.innerWidth;
    if (w > 1300) {
      $(".block-kh-page").toggleClass("open-wide");
    }
  });
  $(".user-login").click(function () {
    $(".block-user").toggleClass("open-box-user");
  });
  $("body").click(function (e) {
    var eventTarget = e.target;
    var listenClick = ".block-user";
    if ($(eventTarget).parents(listenClick).length != 1) {
      $(".block-user").removeClass("open-box-user");
    }
  });
  // Click menu mobile
  $(".icon-nav-sidebar-mb").click(function () {
    $(".main-sidebar-left").addClass("open-sidebar");
    $(".bg-sidebar-left").addClass("open-bg");
    $("body").addClass("overflow-hidden");
  });
  $(".close-popup-sidebar,.bg-sidebar-left").click(function () {
    $(".main-sidebar-left").removeClass("open-sidebar");
    $(".bg-sidebar-left").removeClass("open-bg");
    $("body").removeClass("overflow-hidden");
  });

  $(".block-nav-menu-bt").click(function () {
    $(".wrap").toggleClass("compact-sidebar");
  });
  // Ckick tab thông báo
  $(".item-support-topbar").click(function () {
    $(".item-support-topbar").removeClass("active");
    $(this).addClass("active");
  });
  $("body").click(function (e) {
    var eventTarget = e.target;
    var listenClick = ".lst-call-noti";
    if ($(eventTarget).parents(listenClick).length != 1) {
      $(".item-support-topbar").removeClass("active");
    }
  });
  // Click box user menu
  $(".flex-user").click(function () {
    $(".box-user-login").toggleClass("open-box");
  });
  $(".status-user").click(function () {
    $(".box-user-login").toggleClass("open-box");
  });
  $("body").click(function (e) {
    var eventTarget = e.target;
    var listenClick = ".box-user-login";
    if ($(eventTarget).parents(listenClick).length != 1) {
      $(".box-user-login").removeClass("open-box");
    }
  });
  // Sscroll fixed add class
  $(window).scroll(function (event) {
    offsetAdd = $(window).scrollTop();
    if (offsetAdd > 10) {
      $(".topbar-fixed").addClass("scroll-page");
    } else {
      $(".topbar-fixed").removeClass("scroll-page");
    }
  });
  $(window).scroll(function (event) {
    if (offsetAdd > 10) {
      $(".menu-topbar-mobile").addClass("scroll");
    } else {
      $(".menu-topbar-mobile").removeClass("scroll");
    }
  });

  // Click box bộ lọc
  $(".box-filter-search").click(function () {
    $(".box-popup-filter-search").addClass("open-box-filter");
  });
  $(".icon-close-box").click(function () {
    $(".box-popup-filter-search ").removeClass("open-box-filter");
  });
  $("body").click(function (e) {
    var eventTarget = e.target;
    var listenClick = ".filter-search";
    if ($(eventTarget).parents(listenClick).length != 1) {
      $(".box-popup-filter-search ").removeClass("open-box-filter");
    }
  });
  // Click box bộ lọc
  $(".box-filter-search").click(function () {
    $(".box-popup-filter-search").addClass("open-box-filter");
  });
  $(".box-popup-filter-search .icon-close-box").click(function () {
    $(".box-popup-filter-search ").removeClass("open-box-filter");
  });
  $("body").click(function (e) {
    var eventTarget = e.target;
    var listenClick = ".filter-search";
    if ($(eventTarget).parents(listenClick).length != 1) {
      $(".box-popup-filter-search ").removeClass("open-box-filter");
    }
  });
  // Click box sắp xếp
  $(".title-box-ss-column").click(function () {
    $(".box-popup-ss-column").addClass("open-box-ss");
  });
  $(".box-popup-ss-column .icon-close-box").click(function () {
    $(".box-popup-ss-column").removeClass("open-box-ss");
  });
  $("body").click(function (e) {
    var eventTarget = e.target;
    var listenClick = ".box-ss-column";
    if ($(eventTarget).parents(listenClick).length != 1) {
      $(".box-popup-ss-column").removeClass("open-box-ss");
    }
  });

  // Click tab
  $(".box-info-hs-crm .title-box .arrow").click(function () {
    $(this).parents(".box-info-hs-crm").toggleClass("active");
  });

  // Click sidebar Hồ sơ
  $(".box-mobile-menu-sidebar").click(function (e) {
    $("body").addClass("overflow-hidden");
    $(".sidebar-hs-new").addClass("open-sidebar-hs");
    $(".navigation-sidebar").addClass("open-sidebar-hs");
    $(".sidebar-bc.course-create").addClass("side-wth-popup");

    $(".sidebar-contract").addClass("side-wth-popup");
  });
  $(".close-popup-sidebar-hs").click(function (e) {
    $("body").removeClass("overflow-hidden");
    $(".sidebar-hs-new").removeClass("open-sidebar-hs");
    $(".navigation-sidebar").removeClass("open-sidebar-hs");
    $(".sidebar-bc.course-create").removeClass("side-wth-popup");
    $(".sidebar-contract").removeClass("side-wth-popup");
  });
  // CLick sidebar hồ sơ 2025
  $(".box-mobile-menu-sidebar").click(function (e) {
    $("body").addClass("overflow-hidden");
    $(".sidebar-box-dp").addClass("open-sidebar");
  });
  $(".close-popup-sidebar-hs").click(function (e) {
    $("body").removeClass("overflow-hidden");
    $(".sidebar-box-dp").removeClass("open-sidebar");
  });

  $(".sidebar-mb--btn").click(function (e) {
    $("body").addClass("overflow-hidden");
    $(".sidebar-gn").addClass("open-sidebar");
  });
  $(".close-popup-sidebar").click(function (e) {
    $("body").removeClass("overflow-hidden");
    $(".sidebar-gn").removeClass("open-sidebar");
  });

  // Click sidebar
  $(".icon-sidebar").click(function (e) {
    $(".sidebar-site").addClass("open-sidebar");
    $("body").addClass("overflow-hidden");
  });

  $(".close-popup-sidebar,.bg-sidebar").click(function (e) {
    $(".sidebar-site").removeClass("open-sidebar");
    $("body").removeClass("overflow-hidden");
  });

  // Click icon question

  $(".back-sidebar").click(function () {
    $(".wp-site-2025").toggleClass("compact-sidebar");
  });
});
function toggleMenu(el) {
  // Ẩn tất cả menu khác trước
  document.querySelectorAll(".finance-2025-action-menu").forEach((menu) => {
    if (menu !== el.querySelector(".finance-2025-action-menu")) {
      menu.classList.remove("active");
    }
  });

  // Toggle menu hiện tại
  const menu = el.querySelector(".finance-2025-action-menu");
  menu.classList.toggle("active");
}

// Ẩn menu khi click ra ngoài
document.addEventListener("click", function (e) {
  if (!e.target.closest(".finance-2025-dots")) {
    document.querySelectorAll(".finance-2025-action-menu").forEach((menu) => {
      menu.classList.remove("active");
    });
  }
  $(document).on(
    "click",
    ".item-nav-group-child .nav-parent .icon-illus, .item-nav-group-child .nav-parent .icon",
    function (e) {
      e.preventDefault();
      e.stopPropagation();

      const $group = $(this).closest(".item-nav-group-child");
      $group.toggleClass("open-nav-child");
    },
  );
});
document.addEventListener("DOMContentLoaded", function () {
  var optionsBar = {
    chart: {
      type: "bar", // Bắt buộc dùng 'bar' trong ApexCharts
      height: 350, // Nên khai báo chiều cao mặc định
    },

    plotOptions: {
      bar: {
        horizontal: false, // false = Cột dọc (Column), true = Thanh ngang (Bar)
        columnWidth: "45%", // Độ rộng của cột (giúp cột không bị quá béo)
        borderRadius: 4, // Bo nhẹ góc trên của cột cho hiện đại
      },
    },
    dataLabels: {
      enabled: false, // Tắt việc hiển thị con số trực tiếp trên cột để tránh rối mắt
    },
    series: [
      {
        name: "Sales",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      tooltip: {
        enabled: false, // Tắt tooltip thừa ở trục X
      },
    },
    yaxis: {
      title: {
        text: "Doanh số", // Tiêu đề trục Y (tuỳ chọn)
      },
    },
    colors: ["#0d6efd"], // Set màu chủ đạo cho cột (ví dụ màu xanh primary của Bootstrap)
  };
  var optionsPie = {
    chart: {
      type: "pie", // Chuyển thành 'pie'
      height: 350,
    },
    // Dữ liệu của biểu đồ tròn
    series: [30, 40, 35, 50, 49, 60],

    // Nhãn tương ứng với các con số ở trên
    labels: [
      "Doanh thu sách IT",
      "Sách kinh tế",
      "Tiểu thuyết",
      "Thiết bị",
      "Văn phòng phẩm",
      "Khác",
    ],

    // Mảng màu sắc tương ứng
    colors: ["#0d6efd", "#20c997", "#ffc107", "#fd7e14", "#dc3545", "#6f42c1"],

    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },

    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },

    // [ĐÃ SỬA LẠI PHẦN NÀY] Đẩy legend sang nằm cạnh pie
    legend: {
      position: "right", // Đẩy toàn bộ cụm chú giải sang bên phải
      offsetY: 20, // Căn dịch xuống một chút cho cân bằng với tâm biểu đồ

      // Căn chỉnh khoảng cách giữa các dòng
      itemMargin: {
        horizontal: 0,
        vertical: 10, // Khoảng cách chiều dọc giữa các nhãn cho thoáng
      },

      fontSize: "14px",
      fontWeight: 400,
      markers: {
        radius: 12, // Bo tròn icon màu
      },
    },

    // Khắc phục lỗi viền đen mờ khi click chuột vào múi tròn
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
    },
  };
  var optionsLine = {
    chart: {
      type: "line",
      height: 350,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      colors: ["#ffffff"],
      strokeColors: "#0d6efd",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: "Doanh số",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: "Doanh số",
      },
    },
    colors: ["#0d6efd"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: {
        useSeriesColors: true,
      },
      markers: {
        width: 16,
        height: 6,
        strokeWidth: 2,
        strokeColor: "#fff",
        radius: 12,
        customHTML: function () {
          return '<span class="legend-line-through"></span>';
        },
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5,
      },
    },
  };
  var chartCol = new ApexCharts(
    document.querySelector("#chartCol"),
    optionsBar,
  );
  var chartPie = new ApexCharts(
    document.querySelector("#chartPie"),
    optionsPie,
  );
  var chartLine = new ApexCharts(
    document.querySelector("#chartLine"),
    optionsLine,
  );
  chartCol.render();
  chartPie.render();
  chartLine.render();
});
