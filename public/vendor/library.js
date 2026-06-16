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

  const $contentTable = $(".content-table");
  const $titleTable = $(".imt-title-table");
  if ($contentTable && $titleTable && $contentTable.children().length == 0) {
    $titleTable.css({
      "min-width": "auto",
      "max-width": "none",
    });
  }

  $(document)
    .on("mouseenter", ".wth-tooltip", function () {
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
        });
      }
    })
    .on("mouseleave", ".wth-tooltip", function () {
      const $tooltip = $(this).find(".topbar-tooltip");

      if ($tooltip) {
        $tooltip.css({
          visibility: "hidden",
          opacity: "0",
        });
      }
    });

  if (typeof $.fn.tooltip === "function") {
    $('[data-toggle="tooltip"]').tooltip();
  }

});