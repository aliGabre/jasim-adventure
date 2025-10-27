#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
خادم ويب متقدم لتشغيل لعبة مغامرات جاسم المحسنة
Advanced Web Server for Optimized Jasim Adventure Game
"""

import http.server
import socketserver
import os
import json
import time
import threading
import webbrowser
from urllib.parse import urlparse, parse_qs
import socket
import ssl
import logging
from pathlib import Path

class SuperMarioGameServer:
    """خادم ويب متقدم للعبة سوبر ماريو المحسنة"""
    
    def __init__(self, port=8000, host='localhost'):
        self.port = port
        self.host = host
        self.server = None
        self.is_running = False
        self.start_time = time.time()
        self.request_count = 0
        self.game_stats = {
            'players_online': 0,
            'total_requests': 0,
            'game_starts': 0,
            'errors': 0
        }
        
        # إعداد التسجيل
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('super-mario-server.log', encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # إنشاء مجلد السجلات
        Path('logs').mkdir(exist_ok=True)
        
    def get_local_ip(self):
        """الحصول على عنوان IP المحلي"""
        try:
            # الاتصال بمخدوم DNS للحصول على IP المحلي
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except Exception:
            return '127.0.0.1'
    
    def create_ssl_context(self):
        """إنشاء سياق SSL (اختياري)"""
        try:
            context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
            # يمكن إضافة شهادات SSL هنا
            return context
        except Exception as e:
            self.logger.warning(f"SSL context creation failed: {e}")
            return None
    
    class GameRequestHandler(http.server.SimpleHTTPRequestHandler):
        """معالج طلبات اللعبة المحسن"""
        
        def __init__(self, *args, **kwargs):
            self.server_instance = kwargs.pop('server_instance', None)
            super().__init__(*args, **kwargs)
        
        def log_message(self, format, *args):
            """تسجيل الرسائل مع معلومات إضافية"""
            if self.server_instance:
                self.server_instance.request_count += 1
                self.server_instance.game_stats['total_requests'] += 1
            
            # تسجيل مفصل للطلبات
            client_ip = self.client_address[0]
            user_agent = self.headers.get('User-Agent', 'Unknown')
            self.server_instance.logger.info(
                f"Request: {client_ip} - {self.command} {self.path} - {user_agent}"
            )
        
        def do_GET(self):
            """معالجة طلبات GET"""
            try:
                # تحليل المسار
                parsed_path = urlparse(self.path)
                path = parsed_path.path
                query_params = parse_qs(parsed_path.query)
                
                # إحصائيات خاصة
                if path == '/stats':
                    self.send_game_stats()
                    return
                elif path == '/health':
                    self.send_health_check()
                    return
                elif path == '/api/game-info':
                    self.send_game_info()
                    return
                
                # معالجة الملفات
                if path == '/' or path == '/index.html':
                    path = '/super-mario-optimized.html'
                
                # تحديد نوع المحتوى
                content_type = self.get_content_type(path)
                
                # قراءة الملف
                file_path = self.translate_path(path)
                
                if os.path.isfile(file_path):
                    self.serve_file(file_path, content_type)
                else:
                    self.send_error(404, "File not found")
                    
            except Exception as e:
                self.server_instance.logger.error(f"Error handling GET request: {e}")
                self.server_instance.game_stats['errors'] += 1
                self.send_error(500, "Internal server error")
        
        def do_POST(self):
            """معالجة طلبات POST"""
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                if self.path == '/api/game-start':
                    self.handle_game_start(post_data)
                elif self.path == '/api/game-end':
                    self.handle_game_end(post_data)
                else:
                    self.send_error(404, "Endpoint not found")
                    
            except Exception as e:
                self.server_instance.logger.error(f"Error handling POST request: {e}")
                self.server_instance.game_stats['errors'] += 1
                self.send_error(500, "Internal server error")
        
        def get_content_type(self, path):
            """تحديد نوع المحتوى بناءً على امتداد الملف"""
            content_types = {
                '.html': 'text/html; charset=utf-8',
                '.js': 'application/javascript; charset=utf-8',
                '.css': 'text/css; charset=utf-8',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.ico': 'image/x-icon',
                '.json': 'application/json; charset=utf-8',
                '.txt': 'text/plain; charset=utf-8'
            }
            
            ext = os.path.splitext(path)[1].lower()
            return content_types.get(ext, 'application/octet-stream')
        
        def serve_file(self, file_path, content_type):
            """خدمة الملف مع تحسينات"""
            try:
                with open(file_path, 'rb') as file:
                    content = file.read()
                
                # إضافة headers للأداء
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(len(content)))
                
                # تحسينات الأداء
                if file_path.endswith(('.js', '.css')):
                    self.send_header('Cache-Control', 'public, max-age=3600')
                elif file_path.endswith('.html'):
                    self.send_header('Cache-Control', 'no-cache')
                
                # CORS للهاتف
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                
                self.end_headers()
                self.wfile.write(content)
                
            except Exception as e:
                self.server_instance.logger.error(f"Error serving file {file_path}: {e}")
                self.send_error(500, "Error reading file")
        
        def send_game_stats(self):
            """إرسال إحصائيات اللعبة"""
            stats = {
                'server_uptime': time.time() - self.server_instance.start_time,
                'total_requests': self.server_instance.game_stats['total_requests'],
                'players_online': self.server_instance.game_stats['players_online'],
                'game_starts': self.server_instance.game_stats['game_starts'],
                'errors': self.server_instance.game_stats['errors'],
                'server_version': '1.0.0',
                'game_name': 'مغامرات جاسم - نسخة سوبر ماريو المحسنة'
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(stats, ensure_ascii=False, indent=2).encode('utf-8'))
        
        def send_health_check(self):
            """فحص صحة الخادم"""
            health = {
                'status': 'healthy',
                'timestamp': time.time(),
                'uptime': time.time() - self.server_instance.start_time
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(health).encode('utf-8'))
        
        def send_game_info(self):
            """معلومات اللعبة"""
            game_info = {
                'title': 'مغامرات جاسم - نسخة سوبر ماريو المحسنة',
                'version': '2.0.0',
                'features': [
                    'خلفيات مشابهة لسوبر ماريو',
                    'أعداء ورسومات مختلفة لكل مستوى',
                    'أزرار تحكم محسنة للهاتف',
                    'نظام تصادم محسن',
                    'تجميع الكائنات',
                    'مراقب الأداء التلقائي'
                ],
                'controls': {
                    'keyboard': {
                        'movement': 'Arrow Keys / WASD',
                        'jump': 'Space / W',
                        'fire': 'Ctrl (تغيير من Alt)',
                        'down': 'S / Down Arrow'
                    },
                    'mobile': {
                        'movement': 'أزرار الاتجاهات',
                        'jump': 'زر القفز',
                        'fire': 'زر الرصاص',
                        'special': 'أزرار إضافية'
                    }
                },
                'levels': [
                    'السهول - خلفية ماريو الكلاسيكية',
                    'الهضاب - مناظر طبيعية جميلة',
                    'تحت الأرض - عالم مظلم وغامق',
                    'الصحراء - رمال ذهبية وشمس حارقة',
                    'الثلوج - جبال بيضاء وثلوج متساقطة',
                    'الجزر السماوية - سحب بيضاء وسماء زرقاء',
                    'القلعة - حجارة رمادية وأبراج شاهقة'
                ]
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(game_info, ensure_ascii=False, indent=2).encode('utf-8'))
        
        def handle_game_start(self, post_data):
            """معالجة بدء اللعبة"""
            try:
                data = json.loads(post_data.decode('utf-8'))
                self.server_instance.game_stats['game_starts'] += 1
                self.server_instance.game_stats['players_online'] += 1
                
                response = {
                    'status': 'success',
                    'message': 'تم بدء اللعبة بنجاح',
                    'game_id': f"game_{int(time.time())}",
                    'timestamp': time.time()
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                
            except Exception as e:
                self.server_instance.logger.error(f"Error handling game start: {e}")
                self.send_error(400, "Invalid game start data")
        
        def handle_game_end(self, post_data):
            """معالجة انتهاء اللعبة"""
            try:
                data = json.loads(post_data.decode('utf-8'))
                self.server_instance.game_stats['players_online'] = max(0, self.server_instance.game_stats['players_online'] - 1)
                
                response = {
                    'status': 'success',
                    'message': 'تم إنهاء اللعبة',
                    'final_score': data.get('score', 0),
                    'level_reached': data.get('level', 1),
                    'timestamp': time.time()
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                
            except Exception as e:
                self.server_instance.logger.error(f"Error handling game end: {e}")
                self.send_error(400, "Invalid game end data")
    
    def start_server(self):
        """بدء الخادم"""
        try:
            # إنشاء معالج الطلبات
            handler = type('GameHandler', (self.GameRequestHandler,), {
                'server_instance': self
            })
            
            # إنشاء الخادم
            with socketserver.TCPServer((self.host, self.port), handler) as httpd:
                self.server = httpd
                self.is_running = True
                
                # الحصول على عنوان IP المحلي
                local_ip = self.get_local_ip()
                
                self.logger.info("=" * 60)
                self.logger.info("🎮 خادم لعبة سوبر ماريو المحسنة يعمل الآن!")
                self.logger.info("=" * 60)
                self.logger.info(f"🌐 العنوان المحلي: http://{self.host}:{self.port}")
                self.logger.info(f"🌍 العنوان الشبكي: http://{local_ip}:{self.port}")
                self.logger.info(f"📱 للهاتف: http://{local_ip}:{self.port}")
                self.logger.info("=" * 60)
                self.logger.info("🎯 الملف الرئيسي: /super-mario-optimized.html")
                self.logger.info("📊 الإحصائيات: /stats")
                self.logger.info("❤️ فحص الصحة: /health")
                self.logger.info("ℹ️ معلومات اللعبة: /api/game-info")
                self.logger.info("=" * 60)
                self.logger.info("💡 اضغط Ctrl+C لإيقاف الخادم")
                self.logger.info("=" * 60)
                
                # فتح المتصفح تلقائياً
                try:
                    webbrowser.open(f'http://{self.host}:{self.port}/super-mario-optimized.html')
                except:
                    pass
                
                # بدء الخادم
                httpd.serve_forever()
                
        except KeyboardInterrupt:
            self.logger.info("\n🛑 تم إيقاف الخادم بواسطة المستخدم")
        except Exception as e:
            self.logger.error(f"❌ خطأ في تشغيل الخادم: {e}")
        finally:
            self.stop_server()
    
    def stop_server(self):
        """إيقاف الخادم"""
        if self.server and self.is_running:
            self.server.shutdown()
            self.is_running = False
            self.logger.info("🛑 تم إيقاف الخادم")
    
    def get_status(self):
        """الحصول على حالة الخادم"""
        return {
            'is_running': self.is_running,
            'uptime': time.time() - self.start_time,
            'request_count': self.request_count,
            'game_stats': self.game_stats
        }

def main():
    """الدالة الرئيسية"""
    print("🎮 خادم لعبة سوبر ماريو المحسنة")
    print("=" * 50)
    
    # إعدادات الخادم
    PORT = 8000
    HOST = '0.0.0.0'  # للوصول من الشبكة
    
    try:
        # إنشاء الخادم
        server = SuperMarioGameServer(port=PORT, host=HOST)
        
        # بدء الخادم
        server.start_server()
        
    except Exception as e:
        print(f"❌ خطأ في تشغيل الخادم: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())