import Spline from '@splinetool/react-spline';

export default function SplineIcon() {
  return (
    <div className="fixed right-4 bottom-4 w-[300px] h-[300px] z-50">
      <Spline scene="https://prod.spline.design/YOUR-SPLINE-URL/scene.splinecode" />
    </div>
  );
}
