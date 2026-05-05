// PNG logo — replaces the inline SVG. gradientId arg kept for backwards-compat
// with existing call sites; it's ignored.
export default function BrandLogo() {
    return (
        <img
            src="/images.png"
            alt="Sarayo Alwadiya"
            className="brand-img"
        />
    );
}
