/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';

import book from './assets/Парадокс Шимпанзе. Менеджмент мозга.pdf';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);

  // Сохранение и применение аннотаций
  const handleSaveAndApply = async () => {
    try {
      if (viewerInstanceRef.current) {
        const { Core } = viewerInstanceRef.current;
        const xfdfString = await Core.annotationManager.exportAnnotations();
        localStorage.setItem('pdf_annotations', xfdfString); // Сохраняем аннотации в localStorage
        console.log('Аннотации сохранены в localStorage:', xfdfString);

        // Применяем сохраненные аннотации
        await Core.annotationManager.importAnnotations(xfdfString);
        console.log('Аннотации успешно применены.');
      }
    } catch (error) {
      console.error('Ошибка при сохранении и применении аннотаций:', error);
    }
  };

  useEffect(() => {
    WebViewer(
      {
        path: 'lib',
        licenseKey: 'demo:1729834710515:7e11046b0300000000a3015cf7987e8282bf92a35ab6f7aa257912a304',
        initialDoc: book,
      },
      containerRef.current as HTMLDivElement,
    )
      .then((instance) => {
        viewerInstanceRef.current = instance;
        const { annotationManager } = instance.Core;

        // Включение аннотаций
        annotationManager.enableAnnotations();

        // Применение аннотаций при загрузке
        const savedAnnotations = localStorage.getItem('pdf_annotations');
        if (savedAnnotations) {
          instance.Core.documentViewer.addEventListener('documentLoaded', async () => {
            try {
              await annotationManager.importAnnotations(savedAnnotations);
              console.log('Сохраненные аннотации применены при загрузке.');
            } catch (error) {
              console.error('Ошибка при применении аннотаций при загрузке:', error);
            }
          });
        }
      })
      .catch((error) => {
        console.error('Ошибка инициализации WebViewer:', error);
      });
  }, []);

  return (
    <div style={{ height: '90vh' }}>
      <div className="relative">
        <div ref={containerRef} className="w-full h-[90vh]"></div>
      </div>
      <div className="fixed bottom-4 right-4">
        <button className="px-4 py-2 text-white bg-blue-600 rounded" onClick={handleSaveAndApply}>
          Save & Apply
        </button>
      </div>
    </div>
  );
}

export default App;
