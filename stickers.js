(() => {
    const hero = document.querySelector(".main-section");
    const stickers = document.querySelectorAll(".draggable-sticker");
    if (!hero || stickers.length === 0) return;

    const dragThreshold = 5;
    const topNavOffset = 63;
    let topZ = 15;

    function handleStickerClick(pic) {
        const action = pic.dataset.action;
        console.log("Clicked sticker:", action || pic.alt);
    }

    function setupDraggableSticker(pic) {
        let isPointerDown = false;
        let isDragging = false;
        let startClientX = 0;
        let startClientY = 0;
        let startLeft = 0;
        let startTop = 0;

        pic.addEventListener("pointerdown", (e) => {
            if (e.button !== 0 && e.pointerType === "mouse") return;

            isPointerDown = true;
            isDragging = false;
            topZ += 1;
            pic.style.zIndex = topZ;

            const heroRect = hero.getBoundingClientRect();
            const picRect = pic.getBoundingClientRect();

            startLeft = picRect.left - heroRect.left;
            startTop = picRect.top - heroRect.top;
            startClientX = e.clientX;
            startClientY = e.clientY;

            pic.style.left = `${startLeft}px`;
            pic.style.top = `${startTop}px`;
            pic.style.right = "auto";
            pic.style.bottom = "auto";

            pic.setPointerCapture(e.pointerId);
        });

        pic.addEventListener("pointermove", (e) => {
            if (!isPointerDown) return;

            const dx = e.clientX - startClientX;
            const dy = e.clientY - startClientY;

            if (!isDragging && Math.hypot(dx, dy) >= dragThreshold) {
                isDragging = true;
                pic.classList.add("is-dragging");
            }

            if (isDragging) {
                const maxLeft = hero.clientWidth - pic.offsetWidth;
                const maxTop = hero.clientHeight - pic.offsetHeight;

                const clampedLeft = Math.min(Math.max(0, startLeft + dx), Math.max(0, maxLeft));
                const clampedTop = Math.min(Math.max(topNavOffset, startTop + dy), Math.max(topNavOffset, maxTop));

                pic.style.left = `${clampedLeft}px`;
                pic.style.top = `${clampedTop}px`;
            }
        });

        function finishPointer(e) {
            if (!isPointerDown) return;

            const wasDragging = isDragging;
            isPointerDown = false;
            isDragging = false;
            pic.classList.remove("is-dragging");

            if (pic.hasPointerCapture(e.pointerId)) {
                pic.releasePointerCapture(e.pointerId);
            }

            if (!wasDragging) {
                handleStickerClick(pic);
            }
        }

        pic.addEventListener("pointerup", finishPointer);
        pic.addEventListener("pointercancel", finishPointer);
    }

    function handleStickerClick(pic) {
        if (pic.dataset.url) {
            window.location.href = pic.dataset.url;
        }
    }

    stickers.forEach(setupDraggableSticker);
})();