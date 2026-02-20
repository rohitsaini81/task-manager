import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Task Manager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF6C63FF)),
        scaffoldBackgroundColor: const Color(0xFFF9F6FF),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (_) => const WelcomeScreen(),
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/verify-otp': (_) => const VerifyOtpScreen(),
        '/home': (_) => const HomeScreen(),
        '/homepage': (_) => const HomepageScreen(),
        '/connections': (_) => const ConnectionsScreen(),
      },
      onGenerateRoute: (settings) {
        final name = settings.name;
        if (name != null && name.startsWith('/project/')) {
          final projectId = name.replaceFirst('/project/', '');
          return MaterialPageRoute<void>(
            builder: (_) => ProjectScreen(projectId: projectId),
            settings: settings,
          );
        }
        return null;
      },
    );
  }
}

class AppConfig {
  static const String server = 'http://localhost:3000/api/';
}

class SessionStore {
  static Future<String?> sessionId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('sessionId');
  }

  static Future<Map<String, dynamic>?> user() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('user');
    if (raw == null) return null;
    return jsonDecode(raw) as Map<String, dynamic>;
  }

  static Future<void> save({
    required String sessionId,
    required Map<String, dynamic> user,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('sessionId', sessionId);
    await prefs.setString('user', jsonEncode(user));
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('sessionId');
    await prefs.remove('user');
  }
}

class ApiClient {
  static Map<String, dynamic> _decodeMap(http.Response response) {
    if (response.body.isEmpty) return <String, dynamic>{};
    final decoded = jsonDecode(response.body);
    if (decoded is Map<String, dynamic>) return decoded;
    return <String, dynamic>{'data': decoded};
  }

  static List<dynamic> _decodeList(http.Response response) {
    if (response.body.isEmpty) return <dynamic>[];
    final decoded = jsonDecode(response.body);
    if (decoded is List<dynamic>) return decoded;
    return <dynamic>[];
  }

  static Future<Map<String, dynamic>> login({
    required String phone,
    required String password,
  }) async {
    final uri = Uri.parse('${AppConfig.server}auth/login');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phone': phone, 'password': password}),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> register({
    required String username,
    required String phone,
    required String password,
  }) async {
    final uri = Uri.parse('${AppConfig.server}auth/register');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'phone': phone,
        'password': password,
      }),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> verifyOtp({
    required String phone,
    required String otp,
  }) async {
    final uri = Uri.parse('${AppConfig.server}auth/verify/otp');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phone': phone, 'otp': otp}),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> resendOtp(String phone) async {
    final normalizedPhone = phone.startsWith('+') ? phone : '+91$phone';
    final uri = Uri.parse(
      '${AppConfig.server}auth/resend/otp?phone=$normalizedPhone',
    );
    final response = await http.get(
      uri,
      headers: {'Content-Type': 'application/json'},
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> verifyUser(String sessionId) async {
    final uri = Uri.parse('${AppConfig.server}auth/verify');
    final response = await http.get(
      uri,
      headers: {'Authorization': 'Bearer $sessionId'},
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> getProjects(String sessionId) async {
    final uri = Uri.parse('${AppConfig.server}project/all');
    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> createProject({
    required String sessionId,
    required String title,
    required String description,
  }) async {
    final uri = Uri.parse('${AppConfig.server}project/create');
    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
      body: jsonEncode({
        'projectName': title,
        'projectDescription': description,
        'projectStatus': 'active',
      }),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> deleteProject({
    required String sessionId,
    required String projectId,
  }) async {
    final uri = Uri.parse('${AppConfig.server}project/delete/$projectId');
    final response = await http.delete(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
      body: jsonEncode({'projectStatus': 'deleted'}),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> getTasks({
    required String sessionId,
    required String projectId,
  }) async {
    final uri = Uri.parse('${AppConfig.server}task/$projectId');
    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
    );
    final list = _decodeList(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': list,
    };
  }

  static Future<Map<String, dynamic>> createTask({
    required String sessionId,
    required String projectId,
    required String title,
    required String content,
    required DateTime dueDate,
  }) async {
    final uri = Uri.parse('${AppConfig.server}task/create');
    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
      body: jsonEncode({
        'projectId': projectId,
        'title': title,
        'content': content,
        'dueDate': dueDate.toIso8601String(),
      }),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> deleteTask({
    required String sessionId,
    required String projectId,
    required String taskId,
  }) async {
    final uri = Uri.parse('${AppConfig.server}task/$taskId');
    final response = await http.delete(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
      body: jsonEncode({'projectId': projectId}),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }

  static Future<Map<String, dynamic>> getComments({
    required String sessionId,
    required String taskId,
  }) async {
    final uri = Uri.parse('${AppConfig.server}comment/all/$taskId');
    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
    );
    final list = _decodeList(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': list,
    };
  }

  static Future<Map<String, dynamic>> createComment({
    required String sessionId,
    required String projectId,
    required String taskId,
    required String content,
  }) async {
    final uri = Uri.parse('${AppConfig.server}comment/create');
    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $sessionId',
      },
      body: jsonEncode({
        'projectId': projectId,
        'taskId': taskId,
        'content': content,
      }),
    );
    final data = _decodeMap(response);
    return {
      'ok': response.statusCode >= 200 && response.statusCode < 300,
      'data': data,
    };
  }
}

class VerifyOtpArgs {
  const VerifyOtpArgs({required this.phone});

  final String phone;
}

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final TextEditingController _projectIdController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    final sessionId = await SessionStore.sessionId();
    final user = await SessionStore.user();
    if (!mounted) return;
    if (sessionId != null && user != null) {
      final verified = user['Verified_status'] == true;
      Navigator.pushReplacementNamed(context, verified ? '/homepage' : '/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Welcome to Task Manager',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 32,
                  color: Color(0xFF4A3AFF),
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 30),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF6200EE),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  onPressed: () => Navigator.pushNamed(context, '/login'),
                  child: const Text('Login'),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF6200EE),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  onPressed: () => Navigator.pushNamed(context, '/register'),
                  child: const Text('Register'),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _projectIdController,
                decoration: const InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  hintText: 'Enter Project ID',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF4CAF50),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  onPressed: () {
                    final id = _projectIdController.text.trim();
                    if (id.isEmpty) return;
                    Navigator.pushNamed(context, '/project/$id');
                  },
                  child: const Text('Enter Project'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    final sessionId = await SessionStore.sessionId();
    final user = await SessionStore.user();
    if (!mounted) return;
    if (sessionId != null && user != null) {
      final verified = user['Verified_status'] == true;
      Navigator.pushReplacementNamed(context, verified ? '/homepage' : '/home');
    }
  }

  Future<void> _handleLogin() async {
    final phone = _phoneController.text.trim();
    final password = _passwordController.text;
    if (phone.isEmpty || password.isEmpty) {
      _showSnack('Please fill all fields');
      return;
    }

    setState(() => _loading = true);
    final result = await ApiClient.login(phone: phone, password: password);
    setState(() => _loading = false);

    if (!mounted) return;

    if (result['ok'] == true) {
      final data = result['data'] as Map<String, dynamic>;
      final user = data['user'] as Map<String, dynamic>?;
      final sessionId = data['sessionId']?.toString();
      if (user != null && sessionId != null) {
        await SessionStore.save(sessionId: sessionId, user: user);
        final verified = user['Verified_status'] == true;
        if (!mounted) return;
        Navigator.pushNamedAndRemoveUntil(
          context,
          verified ? '/homepage' : '/home',
          (route) => false,
        );
      } else {
        _showSnack('Unexpected response from server');
      }
    } else {
      final data = result['data'] as Map<String, dynamic>;
      _showSnack(data['message']?.toString() ?? 'Invalid credentials');
    }
  }

  void _showSnack(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Text(
                  'Welcome Back!',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF6200EE),
                  ),
                ),
                const SizedBox(height: 30),
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: _inputDecoration('Phone', Icons.call),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: _inputDecoration('Password', Icons.lock),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF6200EE),
                      padding: const EdgeInsets.symmetric(vertical: 15),
                    ),
                    onPressed: _loading ? null : _handleLogin,
                    child: _loading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Login'),
                  ),
                ),
                const SizedBox(height: 20),
                TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/register'),
                  child: const Text("Don't have an account? Register"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint, IconData icon) {
    return InputDecoration(
      hintText: hint,
      prefixIcon: Icon(icon, color: const Color(0xFF6200EE)),
      filled: true,
      fillColor: Colors.white,
      border: const OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(10)),
      ),
    );
  }
}

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _countryCode = '+91';
  bool _loading = false;

  Future<void> _sendOtp() async {
    final username = _usernameController.text.trim();
    final mobile = _mobileController.text.trim();
    final password = _passwordController.text;

    if (username.isEmpty || mobile.isEmpty || password.isEmpty) {
      _showSnack('Please fill all fields');
      return;
    }

    setState(() => _loading = true);
    final phone = '$_countryCode$mobile';
    final result = await ApiClient.register(
      username: username,
      phone: phone,
      password: password,
    );
    setState(() => _loading = false);

    if (!mounted) return;
    if (result['ok'] == true) {
      _showSnack('OTP sent successfully');
      Navigator.pushNamed(
        context,
        '/verify-otp',
        arguments: VerifyOtpArgs(phone: phone),
      );
    } else {
      final data = result['data'] as Map<String, dynamic>;
      _showSnack(data['message']?.toString() ?? 'Please try again');
    }
  }

  void _showSnack(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Text(
                  'Create Account',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF6200EE),
                  ),
                ),
                const SizedBox(height: 30),
                TextField(
                  controller: _usernameController,
                  decoration: _inputDecoration('Username', Icons.person),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _countryCode,
                          items: const [
                            DropdownMenuItem(
                              value: '+91',
                              child: Text('🇮🇳 +91'),
                            ),
                            DropdownMenuItem(
                              value: '+1',
                              child: Text('🇺🇸 +1'),
                            ),
                            DropdownMenuItem(
                              value: '+44',
                              child: Text('🇬🇧 +44'),
                            ),
                            DropdownMenuItem(
                              value: '+61',
                              child: Text('🇦🇺 +61'),
                            ),
                          ],
                          onChanged: (value) {
                            if (value != null) {
                              setState(() => _countryCode = value);
                            }
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: _mobileController,
                        keyboardType: TextInputType.phone,
                        maxLength: 10,
                        decoration: _inputDecoration(
                          'Mobile Number',
                          Icons.call,
                        ).copyWith(counterText: ''),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: _inputDecoration('Password', Icons.lock),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF6200EE),
                      padding: const EdgeInsets.symmetric(vertical: 15),
                    ),
                    onPressed: _loading ? null : _sendOtp,
                    child: _loading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Send OTP'),
                  ),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/login'),
                  child: const Text('Already have an account? Login here'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint, IconData icon) {
    return InputDecoration(
      hintText: hint,
      prefixIcon: Icon(icon, color: const Color(0xFF6200EE)),
      filled: true,
      fillColor: Colors.white,
      border: const OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(10)),
      ),
    );
  }
}

class VerifyOtpScreen extends StatefulWidget {
  const VerifyOtpScreen({super.key});

  @override
  State<VerifyOtpScreen> createState() => _VerifyOtpScreenState();
}

class _VerifyOtpScreenState extends State<VerifyOtpScreen> {
  final TextEditingController _otpController = TextEditingController();
  bool _loading = false;

  VerifyOtpArgs? get _args {
    final raw = ModalRoute.of(context)?.settings.arguments;
    return raw is VerifyOtpArgs ? raw : null;
  }

  Future<void> _verifyOtp() async {
    final args = _args;
    if (args == null) {
      _showSnack('Missing phone number');
      return;
    }

    final otp = _otpController.text.trim();
    if (otp.isEmpty) {
      _showSnack('Please enter OTP');
      return;
    }

    setState(() => _loading = true);
    final result = await ApiClient.verifyOtp(phone: args.phone, otp: otp);
    setState(() => _loading = false);

    if (result['ok'] == true) {
      _showSnack('Phone verified successfully');
    } else {
      final data = result['data'] as Map<String, dynamic>;
      _showSnack(data['message']?.toString() ?? 'Invalid OTP');
    }
  }

  Future<void> _resendOtp() async {
    final args = _args;
    if (args == null) return;

    final result = await ApiClient.resendOtp(args.phone);
    if (!mounted) return;
    if (result['ok'] == true) {
      _showSnack('OTP resent successfully');
    } else {
      final data = result['data'] as Map<String, dynamic>;
      _showSnack(data['message']?.toString() ?? 'Failed to resend OTP');
    }
  }

  void _showSnack(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final phone = _args?.phone ?? '';

    return Scaffold(
      backgroundColor: const Color(0xFFF1F8E9),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.lock_outline,
                  size: 80,
                  color: Color(0xFF4B9CD3),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Enter OTP',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                if (phone.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(phone, style: const TextStyle(color: Colors.black54)),
                ],
                const SizedBox(height: 16),
                TextField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                  decoration: const InputDecoration(
                    hintText: '6-digit OTP',
                    counterText: '',
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(10)),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF7CB342),
                    ),
                    onPressed: _loading ? null : _verifyOtp,
                    child: _loading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Verify OTP'),
                  ),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: _resendOtp,
                  child: const Text('Resend OTP'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _loading = true;
  Map<String, dynamic>? _user;

  @override
  void initState() {
    super.initState();
    _fetchUser();
  }

  Future<void> _fetchUser() async {
    try {
      final sessionId = await SessionStore.sessionId();
      if (sessionId == null) {
        if (!mounted) return;
        Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
        return;
      }

      final result = await ApiClient.verifyUser(sessionId);
      if (!mounted) return;

      if (result['ok'] != true) {
        final data = result['data'] as Map<String, dynamic>;
        _showSnack(data['message']?.toString() ?? 'Failed to fetch user data');
        return;
      }

      final data = result['data'] as Map<String, dynamic>;
      final user = data['user'] as Map<String, dynamic>?;
      if (user == null) return;

      await SessionStore.save(sessionId: sessionId, user: user);

      if (user['Verified_status'] == true) {
        if (!mounted) return;
        Navigator.pushNamedAndRemoveUntil(
          context,
          '/homepage',
          (route) => false,
        );
        return;
      }

      setState(() {
        _user = user;
      });
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  void _showSnack(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Welcome, ${_user?['username'] ?? 'User'}!',
                style: const TextStyle(
                  fontSize: 28,
                  color: Color(0xFF6200EE),
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Mobile: ${_user?['phone'] ?? '-'}',
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 10),
              Text(
                'Verified: ${_user?['Verified_status'] == true ? 'Yes' : 'No'}',
                style: const TextStyle(fontSize: 18),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class HomepageScreen extends StatefulWidget {
  const HomepageScreen({super.key});

  @override
  State<HomepageScreen> createState() => _HomepageScreenState();
}

class _HomepageScreenState extends State<HomepageScreen> {
  final TextEditingController _projectTitleController = TextEditingController();
  final TextEditingController _projectDescriptionController =
      TextEditingController();
  bool _menuOpen = false;
  bool _loading = true;
  List<Map<String, dynamic>> _projects = <Map<String, dynamic>>[];

  @override
  void initState() {
    super.initState();
    _loadProjects();
  }

  Future<void> _loadProjects() async {
    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) {
      if (!mounted) return;
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
      return;
    }

    final result = await ApiClient.getProjects(sessionId);
    if (mounted) {
      setState(() => _loading = false);
    }

    if (result['ok'] != true) {
      return;
    }

    final data = result['data'] as Map<String, dynamic>;
    final items = (data['projects'] as List<dynamic>? ?? <dynamic>[])
        .whereType<Map<String, dynamic>>()
        .map(
          (project) => <String, dynamic>{
            'id': project['_id']?.toString() ?? '',
            'title': project['projectName']?.toString() ?? 'Untitled',
            'description':
                project['projectDescription']?.toString() ??
                'No description available',
          },
        )
        .toList();

    if (mounted) {
      setState(() {
        _projects = items;
      });
    }
  }

  Future<void> _logout() async {
    await SessionStore.clear();
    if (!mounted) return;
    Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
  }

  Future<void> _deleteProject(String projectId) async {
    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) return;

    final result = await ApiClient.deleteProject(
      sessionId: sessionId,
      projectId: projectId,
    );
    if (!mounted) return;

    if (result['ok'] == true) {
      setState(() {
        _projects = _projects
            .where((project) => project['id'] != projectId)
            .toList();
      });
    } else {
      _showSnack('Error deleting project');
    }
  }

  Future<void> _showAddProjectDialog() async {
    final created = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Add New Project'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _projectTitleController,
              decoration: const InputDecoration(labelText: 'Project Title'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _projectDescriptionController,
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Project Description',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Add Project'),
          ),
        ],
      ),
    );

    if (created != true) return;

    final title = _projectTitleController.text.trim();
    final description = _projectDescriptionController.text.trim();
    if (title.isEmpty || description.isEmpty) return;

    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) return;

    final result = await ApiClient.createProject(
      sessionId: sessionId,
      title: title,
      description: description,
    );

    if (!mounted) return;

    if (result['ok'] == true) {
      _projectTitleController.clear();
      _projectDescriptionController.clear();
      _showSnack('Project created successfully');
      await _loadProjects();
    } else {
      _showSnack('Error creating project');
    }
  }

  void _showSnack(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (_menuOpen) setState(() => _menuOpen = false);
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: Stack(
          children: [
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF6C63FF),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          IconButton(
                            onPressed: () {
                              setState(() => _menuOpen = !_menuOpen);
                            },
                            icon: const Icon(Icons.menu, color: Colors.white),
                          ),
                          Container(
                            height: 40,
                            width: 40,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              image: const DecorationImage(
                                image: AssetImage('assets/avatar.jpg'),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Divider(height: 20),
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Projects',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF6C63FF),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Expanded(
                      child: _loading
                          ? const Center(child: CircularProgressIndicator())
                          : ListView.builder(
                              itemCount: _projects.length,
                              itemBuilder: (context, index) {
                                final project = _projects[index];
                                final projectId =
                                    project['id']?.toString() ?? '';

                                return Container(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF4F2FF),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: ListTile(
                                    onTap: () => Navigator.pushNamed(
                                      context,
                                      '/project/$projectId',
                                    ),
                                    title: Text(
                                      project['title']?.toString() ??
                                          'Untitled',
                                      style: const TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF6C63FF),
                                      ),
                                    ),
                                    subtitle: Text(
                                      project['description']?.toString() ?? '',
                                    ),
                                    trailing: PopupMenuButton<String>(
                                      onSelected: (value) {
                                        if (value == 'delete') {
                                          _deleteProject(projectId);
                                        }
                                      },
                                      itemBuilder: (_) => const [
                                        PopupMenuItem<String>(
                                          value: 'edit',
                                          child: Text('Edit'),
                                        ),
                                        PopupMenuItem<String>(
                                          value: 'delete',
                                          child: Text('Delete'),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
              ),
            ),
            AnimatedPositioned(
              duration: const Duration(milliseconds: 300),
              left: _menuOpen ? 0 : -250,
              top: 0,
              bottom: 0,
              child: Container(
                width: 250,
                color: const Color(0xFF6C63FF),
                padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Align(
                      alignment: Alignment.centerRight,
                      child: IconButton(
                        onPressed: () => setState(() => _menuOpen = false),
                        icon: const Icon(Icons.close, color: Colors.white),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Settings',
                      style: TextStyle(color: Colors.white, fontSize: 18),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Profile',
                      style: TextStyle(color: Colors.white, fontSize: 18),
                    ),
                    const SizedBox(height: 20),
                    GestureDetector(
                      onTap: _logout,
                      child: const Text(
                        'Logout',
                        style: TextStyle(color: Colors.white, fontSize: 18),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          backgroundColor: const Color(0xFF6C63FF),
          onPressed: _showAddProjectDialog,
          child: const Icon(Icons.add, color: Colors.white),
        ),
      ),
    );
  }
}

class ProjectScreen extends StatefulWidget {
  const ProjectScreen({super.key, required this.projectId});

  final String projectId;

  @override
  State<ProjectScreen> createState() => _ProjectScreenState();
}

class _ProjectScreenState extends State<ProjectScreen> {
  final TextEditingController _taskNameController = TextEditingController();
  final TextEditingController _taskDescriptionController =
      TextEditingController();
  final TextEditingController _commentController = TextEditingController();

  List<Map<String, dynamic>> _tasks = <Map<String, dynamic>>[];
  List<Map<String, dynamic>> _comments = <Map<String, dynamic>>[];
  DateTime _selectedDate = DateTime.now();
  Map<String, dynamic>? _currentTask;

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) {
      if (!mounted) return;
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
      return;
    }

    final result = await ApiClient.getTasks(
      sessionId: sessionId,
      projectId: widget.projectId,
    );
    if (result['ok'] != true) return;

    final list = (result['data'] as List<dynamic>)
        .whereType<Map<String, dynamic>>()
        .toList();

    if (mounted) {
      setState(() {
        _tasks = list;
      });
    }
  }

  Future<void> _addTask() async {
    final taskName = _taskNameController.text.trim();
    final taskDescription = _taskDescriptionController.text.trim();
    if (taskName.isEmpty || taskDescription.isEmpty) return;

    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) return;

    final result = await ApiClient.createTask(
      sessionId: sessionId,
      projectId: widget.projectId,
      title: taskName,
      content: taskDescription,
      dueDate: _selectedDate,
    );

    if (!mounted) return;

    if (result['ok'] == true) {
      _taskNameController.clear();
      _taskDescriptionController.clear();
      _showSnack('Task added');
      await _loadTasks();
    } else {
      _showSnack('Failed to add task');
    }
  }

  Future<void> _deleteTask(String taskId) async {
    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) return;

    final result = await ApiClient.deleteTask(
      sessionId: sessionId,
      projectId: widget.projectId,
      taskId: taskId,
    );

    if (!mounted) return;

    if (result['ok'] == true) {
      setState(() {
        _tasks = _tasks
            .where((task) => (task['_id']?.toString() ?? '') != taskId)
            .toList();
      });
    } else {
      _showSnack('Failed to delete task');
    }
  }

  Future<void> _fetchComments(String taskId) async {
    final task = _tasks.firstWhere(
      (t) => (t['_id']?.toString() ?? '') == taskId,
      orElse: () => <String, dynamic>{},
    );

    if (task.isEmpty) return;

    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) return;

    _currentTask = task;
    final result = await ApiClient.getComments(
      sessionId: sessionId,
      taskId: taskId,
    );

    if (!mounted) return;

    if (result['ok'] == true) {
      final list =
          (result['data'] as List<dynamic>)
              .whereType<Map<String, dynamic>>()
              .toList()
            ..sort((a, b) {
              final left =
                  DateTime.tryParse(b['createdAt']?.toString() ?? '') ??
                  DateTime(1970);
              final right =
                  DateTime.tryParse(a['createdAt']?.toString() ?? '') ??
                  DateTime(1970);
              return left.compareTo(right);
            });

      setState(() {
        _comments = list;
      });
    }

    await _showCommentsDialog();
  }

  Future<void> _addComment() async {
    if (_currentTask == null) return;

    final content = _commentController.text.trim();
    if (content.isEmpty) return;

    final sessionId = await SessionStore.sessionId();
    if (sessionId == null) return;

    final taskId = _currentTask!['_id']?.toString() ?? '';
    final result = await ApiClient.createComment(
      sessionId: sessionId,
      projectId: widget.projectId,
      taskId: taskId,
      content: content,
    );

    if (result['ok'] == true) {
      _commentController.clear();
      await _fetchComments(taskId);
    }
  }

  Future<void> _showAddTaskDialog() async {
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Add / Assign New Task'),
        content: StatefulBuilder(
          builder: (context, setDialogState) {
            return SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: _taskNameController,
                    decoration: const InputDecoration(hintText: 'Task Name'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _taskDescriptionController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      hintText: 'Task Description',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Due Date: ${_selectedDate.toLocal().toString().split(' ').first}',
                      ),
                      IconButton(
                        onPressed: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _selectedDate,
                            firstDate: DateTime(2000),
                            lastDate: DateTime(2100),
                          );
                          if (picked != null) {
                            setDialogState(() {
                              _selectedDate = picked;
                            });
                          }
                        },
                        icon: const Icon(Icons.calendar_month),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () async {
              await _addTask();
              if (mounted) Navigator.pop(context);
            },
            child: const Text('Add New Task'),
          ),
        ],
      ),
    );
  }

  Future<void> _showCommentsDialog() async {
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Add New Comment'),
        content: SizedBox(
          width: 420,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _commentController,
                decoration: const InputDecoration(hintText: 'Share Your Idea'),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _addComment,
                  child: const Text('Add Comment'),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 220,
                child: ListView.builder(
                  itemCount: _comments.length,
                  itemBuilder: (context, index) {
                    final comment = _comments[index];
                    return Card(
                      child: ListTile(
                        title: Text(comment['createdBy']?.toString() ?? 'User'),
                        subtitle: Text(comment['content']?.toString() ?? ''),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showSnack(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5FF),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              color: const Color(0xFF6C63FF),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: () =>
                        Navigator.pushReplacementNamed(context, '/homepage'),
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                  ),
                  IconButton(
                    onPressed: () =>
                        Navigator.pushNamed(context, '/connections'),
                    icon: const Icon(Icons.person_add, color: Colors.white),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              color: const Color(0xFFEFEFFF),
              child: Text(
                'Project: ${widget.projectId}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _tasks.length,
                itemBuilder: (context, index) {
                  final task = _tasks[index];
                  final taskId =
                      task['_id']?.toString() ?? task['id']?.toString() ?? '';
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: ListTile(
                      title: Text(
                        task['title']?.toString() ??
                            task['content']?.toString() ??
                            '',
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Task ID: $taskId'),
                          Text(
                            'Due Date: ${task['dueDate']?.toString() ?? 'Not set'}',
                          ),
                        ],
                      ),
                      trailing: SizedBox(
                        width: 132,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            IconButton(
                              onPressed: () {},
                              icon: const Text(
                                '👍',
                                style: TextStyle(fontSize: 18),
                              ),
                            ),
                            IconButton(
                              onPressed: () => _fetchComments(taskId),
                              icon: const Icon(Icons.message_outlined),
                            ),
                            PopupMenuButton<String>(
                              onSelected: (value) {
                                if (value == 'delete') {
                                  _deleteTask(taskId);
                                }
                              },
                              itemBuilder: (_) => const [
                                PopupMenuItem<String>(
                                  value: 'edit',
                                  child: Text('Edit'),
                                ),
                                PopupMenuItem<String>(
                                  value: 'delete',
                                  child: Text('Delete'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF6C63FF),
        onPressed: _showAddTaskDialog,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

class ConnectionsScreen extends StatefulWidget {
  const ConnectionsScreen({super.key});

  @override
  State<ConnectionsScreen> createState() => _ConnectionsScreenState();
}

class _ConnectionsScreenState extends State<ConnectionsScreen> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _titleController = TextEditingController();

  List<Map<String, String>> _connections = <Map<String, String>>[
    {'id': '1', 'name': 'John Doe', 'title': 'Software Engineer'},
    {'id': '2', 'name': 'Jane Smith', 'title': 'Product Designer'},
  ];

  String _searchTerm = '';

  Future<void> _showAddConnectionDialog() async {
    final shouldAdd = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Add Connection'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(hintText: 'Full Name'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(hintText: 'Profession / Title'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Add'),
          ),
        ],
      ),
    );

    if (shouldAdd != true) return;

    final name = _nameController.text.trim();
    final title = _titleController.text.trim();
    if (name.isEmpty || title.isEmpty) return;

    setState(() {
      _connections = [
        {
          'id': DateTime.now().millisecondsSinceEpoch.toString(),
          'name': name,
          'title': title,
        },
        ..._connections,
      ];
    });

    _nameController.clear();
    _titleController.clear();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _connections.where((conn) {
      final blob = '${conn['name']} ${conn['title']}'.toLowerCase();
      return blob.contains(_searchTerm.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5FF),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              color: const Color(0xFF6C63FF),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'My Connections',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF6C63FF),
                    ),
                  ),
                  IconButton(
                    onPressed: _showAddConnectionDialog,
                    icon: const Icon(
                      Icons.person_add,
                      color: Color(0xFF6C63FF),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                controller: _searchController,
                decoration: const InputDecoration(
                  hintText: 'Search connections...',
                  prefixIcon: Icon(Icons.search),
                  filled: true,
                ),
                onChanged: (value) {
                  setState(() => _searchTerm = value);
                },
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: filtered.length,
                itemBuilder: (context, index) {
                  final item = filtered[index];
                  return Card(
                    child: ListTile(
                      leading: const CircleAvatar(
                        backgroundImage: AssetImage('assets/avatar.jpg'),
                      ),
                      title: Text(item['name'] ?? ''),
                      subtitle: Text(item['title'] ?? ''),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
