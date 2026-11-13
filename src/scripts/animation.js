
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Flip, ScrollTrigger);

const reduceMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;
const toggleButton = document.querySelector("#toggledark");
const layoutGroup = document.querySelector("#layoutGroup");
const layoutButton = document.querySelector("#changeLayout");
const replayButton = document.querySelector("#replayBtn");

toggleButton?.addEventListener("click", () => {
	const isDark = document.documentElement.classList.toggle("dark");
	toggleButton.setAttribute("aria-pressed", String(isDark));

	if (!reduceMotion) {
		gsap.to(toggleButton, {
			rotation: "+=360",
			duration: 0.2,
			ease: "power2.out",
		});
	}
});

layoutButton?.addEventListener("click", () => {
	if (!layoutGroup) return;

	const state = reduceMotion
		? undefined
		: Flip.getState("#layoutGroup > section");
	layoutGroup.classList.toggle("sm:grid-cols-2");

	if (state) {
		Flip.from(state, {
			duration: 0.5,
			stagger: 0.05,
			ease: "power1.inOut",
			onComplete: () => ScrollTrigger.refresh(),
		});
	}
});

const intro = gsap.timeline({
	defaults: {
		duration: reduceMotion ? 0 : 0.8,
		ease: "power2.out",
	},
});
const sectionAnimations = [];

intro
	.from("header h1", { y: -40, opacity: 0 })
	.from("header nav a", { y: -20, opacity: 0, stagger: 0.15 }, "-=0.4");

replayButton?.addEventListener("click", () => {
	window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
	intro.restart();
	sectionAnimations.forEach((animation) => animation.restart());
});

if (!reduceMotion) {
	gsap.utils.toArray("main #layoutGroup > section").forEach((section) => {
		sectionAnimations.push(
			gsap.from(section, {
				y: 50,
				opacity: 0,
				duration: 0.8,
				ease: "power2.out",
				scrollTrigger: {
					trigger: section,
					start: "top 85%",
					toggleActions: "play none none reverse",
				},
			}),
		);
	});

	gsap.fromTo(
		"#progressBar",
		{ scaleX: 0 },
		{
			scaleX: 1,
			ease: "none",
			scrollTrigger: {
				trigger: document.documentElement,
				start: "top top",
				end: "max",
				scrub: true,
			},
		},
	);
}

  