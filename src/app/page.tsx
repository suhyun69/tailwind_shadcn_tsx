import Image from "next/image";
import { CardWithForm } from "@/components/CardWithForm";
import { LessonForm } from "@/components/LessonForm";
import { ProfileForm } from "@/components/ProfileForm";
import { ProfileList } from "@/components/ProfileList";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* 헤더 */}
      <header className="bg-gray-800 text-white p-4 text-center text-lg font-semibold">
        반응형 Tailwind 레이아웃
      </header>

      {/* 메인 콘텐츠 */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {/* 카드 아이템들 */}
        <ProfileForm />
        <ProfileList />
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">카드 1</h2>
          <p className="text-gray-600">PC에서는 3개, 태블릿에서는 2개, 모바일에서는 1개</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">카드 1</h2>
          <p className="text-gray-600">PC에서는 3개, 태블릿에서는 2개, 모바일에서는 1개</p>
        </div>
        <LessonForm />
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">카드 1</h2>
          <p className="text-gray-600">PC에서는 3개, 태블릿에서는 2개, 모바일에서는 1개</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">카드 2</h2>
          <p className="text-gray-600">자동으로 반응형으로 정렬됨</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">카드 3</h2>
          <p className="text-gray-600">Tailwind의 `grid-cols`를 활용</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">카드 4</h2>
          <p className="text-gray-600">더 많은 콘텐츠 추가 가능</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">카드 5</h2>
          <p className="text-gray-600">PC에서는 3열, 태블릿 2열, 모바일 1열</p>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white p-4 text-center">
        © 2025 반응형 사이트 - All Rights Reserved.
      </footer>
    </div>
  );
}
