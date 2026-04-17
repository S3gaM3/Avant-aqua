/**
 * Модальное окно и AJAX для «Купить в один клик».
 */
(function () {
    'use strict';

    var cfg = typeof avantOcb === 'undefined' ? null : avantOcb;
    if (!cfg) {
        return;
    }

    var modal = document.getElementById('avant-ocb-modal');
    var openBtn = document.getElementById('avant-ocb-open');
    var form = document.getElementById('avant-ocb-form');
    var msg = document.getElementById('avant-ocb-message');

    if (!modal || !openBtn || !form) {
        return;
    }

    function setHidden(el, hidden) {
        if (hidden) {
            el.setAttribute('hidden', 'hidden');
        } else {
            el.removeAttribute('hidden');
        }
    }

    function showMessage(text, isError) {
        if (!msg) {
            return;
        }
        msg.textContent = text;
        msg.style.color = isError ? '#b91c1c' : '#166534';
        setHidden(msg, false);
    }

    function openModal() {
        setHidden(modal, false);
        openBtn.setAttribute('aria-expanded', 'true');
        var first = form.querySelector('input,button');
        if (first) {
            first.focus();
        }
    }

    function closeModal() {
        setHidden(modal, true);
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.focus();
    }

    openBtn.addEventListener('click', function () {
        openModal();
    });

    modal.addEventListener('click', function (e) {
        var t = e.target;
        if (t && t.hasAttribute && t.hasAttribute('data-ocb-close')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
            closeModal();
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        fd.append('action', 'avant_ocb_submit');
        fd.append('nonce', cfg.nonce);
        fd.append('product_id', cfg.productId);

        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = cfg.i18n.sending;
        }

        fetch(cfg.ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: fd,
        })
            .then(function (r) {
                return r.json();
            })
            .then(function (data) {
                if (data && data.success) {
                    showMessage((data.data && data.data.message) || '', false);
                    form.reset();
                } else {
                    var m =
                        (data && data.data && data.data.message) ||
                        cfg.i18n.error;
                    showMessage(m, true);
                }
            })
            .catch(function () {
                showMessage(cfg.i18n.error, true);
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = cfg.i18n.submit;
                }
            });
    });
})();
