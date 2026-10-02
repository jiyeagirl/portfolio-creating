/* 이 프로젝트 전용 두 번째 기기 프레임(iPad Pro 11인치 가로 모드 근사, 1194×834pt).
   PhoneFrame과 동일한 className-prop 계약(색은 baked-in하지 않고 전부 prop으로 주입)을
   따르되, 실버 알루미늄 바디 + 상단 베젤 중앙 카메라 핀홀로 구분한다. watch-frame.tsx와
   같은 선례로 components/shared/에는 두지 않는다(이 프로젝트에서만 쓰는 첫 사용). */
export function IpadFrame({
  children,
  backdropClassName = "bg-white",
  screenClassName = "bg-white text-neutral-900",
  homeIndicatorClassName = "bg-neutral-900/70",
}: {
  children: React.ReactNode;
  backdropClassName?: string;
  screenClassName?: string;
  homeIndicatorClassName?: string;
}) {
  return (
    <div
      data-ipad-frame-backdrop
      className={`relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-10 ${backdropClassName}`}
    >
      <div data-ipad-frame className="relative">
        {/* 좌측 상단 볼륨 버튼, 우측 상단 전원 버튼 — 장식용 미세 디테일 */}
        <div data-ipad-frame-button className="absolute -top-[2px] left-[120px] h-[3px] w-10 rounded-t-sm bg-[#c9c9c9]" />
        <div data-ipad-frame-button className="absolute -top-[2px] right-[120px] h-[3px] w-6 rounded-t-sm bg-[#c9c9c9]" />

        <div
          data-ipad-frame-chassis
          className="overflow-hidden rounded-[40px] bg-gradient-to-b from-[#e6e6e4] to-[#c7c7c4] p-[20px]"
          style={{
            boxShadow:
              "var(--ipad-drop-shadow, 0 50px 120px -24px rgba(0,0,0,0.45)), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {/* 전면 카메라 핀홀, 상단 베젤 중앙 */}
          <div className="pointer-events-none absolute left-1/2 top-[9px] z-40 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#3a3a38]" />

          <div className={`relative h-[834px] w-[1194px] overflow-hidden rounded-[24px] ${screenClassName}`}>
            <div className="h-full w-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {children}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-[7px] z-30 flex justify-center">
              <div className={`h-[4px] w-[120px] rounded-full ${homeIndicatorClassName}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
