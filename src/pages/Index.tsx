import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Draggable from 'react-draggable';

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

interface DraggableElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'editor' | 'preview'>('home');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Мой первый проект', createdAt: '2024-01-15' },
    { id: '2', name: 'Видео презентация', createdAt: '2024-01-10' },
  ]);
  
  const [hasIntro, setHasIntro] = useState(false);
  const [hasBackground, setHasBackground] = useState(false);
  const [draggableElements, setDraggableElements] = useState<DraggableElement[]>([]);
  const [showAudioPermission, setShowAudioPermission] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentView === 'editor') {
      setOrientation('landscape');
    } else {
      setOrientation('portrait');
    }
  }, [currentView]);

  const handleNewProject = () => {
    setCurrentView('editor');
  };

  const handleMyProjects = () => {
    setCurrentView('projects');
  };

  const handleProjectSelect = (projectId: string) => {
    setCurrentView('editor');
  };

  const handleAddIntro = () => {
    setHasIntro(true);
  };

  const handleAddBackground = () => {
    setHasBackground(true);
  };

  const handleAddButtons = () => {
    const newElements = [
      { id: '1', src: '/placeholder.svg', x: 50, y: 50, width: 80, height: 80 },
      { id: '2', src: '/placeholder.svg', x: 150, y: 100, width: 80, height: 80 },
      { id: '3', src: '/placeholder.svg', x: 100, y: 200, width: 80, height: 80 },
    ];
    setDraggableElements(prev => [...prev, ...newElements]);
  };

  const handleRemoveButton = () => {
    setDraggableElements(prev => prev.slice(0, -1));
  };

  const handleRun = () => {
    if (hasIntro) {
      setShowAudioPermission(true);
      setCurrentView('preview');
    } else if (hasBackground) {
      setShowDisclaimerModal(true);
      setCurrentView('preview');
    } else {
      setCurrentView('preview');
    }
  };

  const handleAudioPermission = () => {
    setShowAudioPermission(false);
    setIsPlaying(true);
    // Simulate video playback with intro
    setTimeout(() => {
      setIsPlaying(false);
      // Return to editor or next scene
    }, 6000); // 3 seconds play + 3 seconds fade
  };

  const handleDisclaimerOk = () => {
    setShowDisclaimerModal(false);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleBack = () => {
    setCurrentView('editor');
    setIsPlaying(false);
    setShowAudioPermission(false);
    setShowDisclaimerModal(false);
  };

  // Home Screen (Portrait)
  if (currentView === 'home' && orientation === 'portrait') {
    return (
      <div className="min-h-screen bg-[#2D2D2D] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">Video Creator</h1>
            <p className="text-gray-400">Создавай потрясающие видео</p>
          </div>
          
          <Button 
            onClick={handleNewProject}
            className="w-full h-14 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-lg font-medium rounded-xl"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Новый проект
          </Button>
          
          <Button 
            onClick={handleMyProjects}
            variant="outline"
            className="w-full h-14 border-gray-600 text-white hover:bg-gray-700 text-lg font-medium rounded-xl"
          >
            <Icon name="FolderOpen" size={20} className="mr-2" />
            Мои проекты
          </Button>
        </div>
      </div>
    );
  }

  // Projects List (Portrait)
  if (currentView === 'projects' && orientation === 'portrait') {
    return (
      <div className="min-h-screen bg-[#2D2D2D] p-6">
        <div className="flex items-center mb-6">
          <Button 
            onClick={() => setCurrentView('home')} 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-white ml-4">Мои проекты</h1>
        </div>
        
        <div className="space-y-4">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="bg-gray-800 border-gray-700 p-4 cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => handleProjectSelect(project.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{project.name}</h3>
                  <p className="text-gray-400 text-sm">Создан: {project.createdAt}</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-gray-400" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Editor (Landscape)
  if (currentView === 'editor' && orientation === 'landscape') {
    return (
      <div className="h-screen bg-[#2D2D2D] flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 p-4 flex flex-col space-y-3">
          <h2 className="text-white font-bold text-lg mb-4">Инструменты</h2>
          
          <Button 
            onClick={handleAddIntro}
            variant={hasIntro ? "default" : "outline"}
            className="w-full justify-start"
          >
            <Icon name="Video" size={16} className="mr-2" />
            Заставка
          </Button>
          
          <Button 
            onClick={handleAddBackground}
            variant={hasBackground ? "default" : "outline"}
            className="w-full justify-start"
          >
            <Icon name="Image" size={16} className="mr-2" />
            Добавить фон
          </Button>
          
          <Button 
            onClick={handleAddButtons}
            variant="outline"
            className="w-full justify-start"
          >
            <Icon name="Square" size={16} className="mr-2" />
            Добавить кнопки
          </Button>
          
          <Button 
            onClick={handleRemoveButton}
            variant="outline"
            className="w-full justify-start text-red-400 border-red-400 hover:bg-red-400/10"
          >
            <Icon name="Trash2" size={16} className="mr-2" />
            Удалить кнопку
          </Button>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-gray-900 p-4 flex justify-between items-center">
            <Button 
              onClick={() => setCurrentView('home')}
              variant="ghost"
              className="text-white"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            
            <Button 
              onClick={handleRun}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6"
            >
              <Icon name="Play" size={16} className="mr-2" />
              RUN
            </Button>
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="relative bg-white rounded-lg" style={{ width: '400px', height: '300px' }}>
              {hasBackground && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg opacity-80" />
              )}
              
              {draggableElements.map((element) => (
                <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }}>
                  <div 
                    className="absolute cursor-move"
                    style={{ width: element.width, height: element.height }}
                  >
                    <img 
                      src={element.src} 
                      alt="Draggable button"
                      className="w-full h-full object-cover rounded-lg border-2 border-blue-400"
                    />
                  </div>
                </Draggable>
              ))}
              
              {!hasBackground && draggableElements.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Icon name="Monitor" size={48} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview/Run Mode (Landscape Fullscreen)
  if (currentView === 'preview') {
    return (
      <div className="h-screen bg-black relative overflow-hidden">
        {/* Back Button */}
        <Button 
          onClick={handleBack}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
          size="sm"
        >
          <Icon name="ArrowLeft" size={16} className="mr-1" />
          Назад
        </Button>

        {/* Audio Permission Modal */}
        {showAudioPermission && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
            <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Разрешить звук</h3>
              <p className="text-gray-600 mb-6">Для воспроизведения видео необходимо разрешить звук</p>
              <Button onClick={handleAudioPermission} className="bg-[#3B82F6] hover:bg-[#2563EB]">
                Разрешить
              </Button>
            </div>
          </div>
        )}

        {/* Disclaimer Modal */}
        {showDisclaimerModal && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
            <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Уведомление</h3>
              <p className="text-gray-600 mb-6">Мы никого не пытаемся оскорбить, помни!</p>
              <Button onClick={handleDisclaimerOk} className="bg-[#3B82F6] hover:bg-[#2563EB]">
                Ок
              </Button>
            </div>
          </div>
        )}

        {/* Video Background */}
        {hasBackground && isPlaying && (
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted={false}
            playsInline
          >
            <source src="/assets/2.mp4" type="video/mp4" />
          </video>
        )}

        {/* Intro Video */}
        {hasIntro && isPlaying && (
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted={false}
            playsInline
            onEnded={() => {
              setTimeout(() => {
                setIsPlaying(false);
                handleBack();
              }, 3000);
            }}
          >
            <source src="/assets/1.mp4" type="video/mp4" />
          </video>
        )}

        {/* Draggable Elements in Preview */}
        {!hasIntro && draggableElements.map((element) => (
          <div 
            key={element.id}
            className="absolute cursor-pointer"
            style={{ 
              left: element.x * 2, 
              top: element.y * 2, 
              width: element.width * 2, 
              height: element.height * 2 
            }}
          >
            <img 
              src={element.src} 
              alt="Button"
              className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Index;