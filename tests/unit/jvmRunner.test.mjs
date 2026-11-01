import { describe, it, expect } from 'vitest'
import {
  transpileJavaToJs,
  transpileKotlinToJs,
  executeJvmCode,
  verifyJvmChallenge
} from '../../.vitepress/theme/jvmRunner.mjs'

describe('jvmRunner - In-Browser Java & Kotlin Execution Engine', () => {
  it('executes basic Java code and captures stdout', () => {
    const javaCode = `
      public class Main {
        public static void main(String[] args) {
          int count = 5;
          final String env = "staging";
          System.out.println("Testing on " + env + ": " + count + " items");
        }
      }
    `
    const res = executeJvmCode(javaCode, 'java')
    expect(res.error).toBeNull()
    expect(res.stdout).toBe('Testing on staging: 5 items')
  })

  it('executes basic Kotlin code with string templates and top-level fun', () => {
    const kotlinCode = `
      fun main() {
        val env = "staging"
        var count = 5
        println("Testing on $env: $count items")
      }
    `
    const res = executeJvmCode(kotlinCode, 'kotlin')
    expect(res.error).toBeNull()
    expect(res.stdout).toBe('Testing on staging: 5 items')
  })

  it('handles Kotlin range loops and Elvis operator', () => {
    const kotlinCode = `
      fun main() {
        val nullableHeader: String? = null
        val token = nullableHeader ?: "default-token"
        println(token)
        for (i in 1..3) {
          println("Step $i")
        }
      }
    `
    const res = executeJvmCode(kotlinCode, 'kotlin')
    expect(res.error).toBeNull()
    expect(res.stdout).toContain('default-token')
    expect(res.stdout).toContain('Step 1\nStep 2\nStep 3')
  })

  it('verifies a Java challenge with test cases', () => {
    const studentCode = `
      public class ResponseValidator {
        public static boolean isSuccessful(int statusCode) {
          return statusCode >= 200 && statusCode < 300;
        }
      }
    `
    const testCases = [
      { name: '200 OK is successful', call: 'isSuccessful(200)', expected: true },
      { name: '204 No Content is successful', call: 'isSuccessful(204)', expected: true },
      { name: '404 Not Found is not successful', call: 'isSuccessful(404)', expected: false },
      { name: '500 Server Error is not successful', call: 'isSuccessful(500)', expected: false }
    ]
    const report = verifyJvmChallenge({ code: studentCode, language: 'java', testCases })
    expect(report.allPassed).toBe(true)
    expect(report.passedCount).toBe(4)
  })

  it('verifies a Kotlin challenge with test cases', () => {
    const studentCode = `
      fun isSuccessful(statusCode: Int): Boolean {
        return statusCode in 200..299
      }
    `
    const testCases = [
      { name: '200 OK is successful', call: 'isSuccessful(200)', expected: true },
      { name: '201 Created is successful', call: 'isSuccessful(201)', expected: true },
      { name: '400 Bad Request is not successful', call: 'isSuccessful(400)', expected: false }
    ]
    const report = verifyJvmChallenge({ code: studentCode, language: 'kotlin', testCases })
    expect(report.allPassed).toBe(true)
    expect(report.passedCount).toBe(3)
  })

  it('runs comparison between Java and Kotlin producing equivalent results', () => {
    const javaCode = `
      public class Main {
        public static void main(String[] args) {
          int sum = 0;
          for (int i = 1; i <= 5; i++) {
            sum = sum + i;
          }
          System.out.println("Sum: " + sum);
        }
      }
    `
    const kotlinCode = `
      fun main() {
        var sum = 0
        for (i in 1..5) {
          sum = sum + i
        }
        println("Sum: $sum")
      }
    `
    const javaRes = executeJvmCode(javaCode, 'java')
    const kotlinRes = executeJvmCode(kotlinCode, 'kotlin')

    expect(javaRes.error).toBeNull()
    expect(kotlinRes.error).toBeNull()
    expect(javaRes.stdout).toBe('Sum: 15')
    expect(kotlinRes.stdout).toBe('Sum: 15')
    expect(javaRes.stdout).toBe(kotlinRes.stdout)
  })

  it('filters and transforms collections in Java with streams and Kotlin with lambdas', () => {
    const javaCode = `
      public class StreamTest {
        public static void main(String[] args) {
          final List<String> tests = List.of("login_test", "checkout_failed", "api_failed");
          final List<String> failed = tests.stream()
            .filter(t -> t.contains("failed"))
            .toList();
          System.out.println("Failed count: " + failed.size());
        }
      }
    `
    const kotlinCode = `
      fun main() {
        val tests = listOf("login_test", "checkout_failed", "api_failed")
        val failed = tests.filter { it.contains("failed") }
        println("Failed count: \${failed.size}")
      }
    `
    const jRes = executeJvmCode(javaCode, 'java')
    const kRes = executeJvmCode(kotlinCode, 'kotlin')
    expect(jRes.error).toBeNull()
    expect(kRes.error).toBeNull()
    expect(jRes.stdout).toBe('Failed count: 2')
    expect(kRes.stdout).toBe('Failed count: 2')
  })

  it('verifies Session 2 Challenge 1 (filter problematic tests) in Java and Kotlin', () => {
    const javaCode = `
      public class TestFilter {
        public static List<String> getProblematicTests(List<String> testResults) {
          return testResults.stream()
            .filter(t -> t.contains("FAIL") || t.contains("FLAKY"))
            .toList();
        }
      }
    `
    const kotlinCode = `
      fun getProblematicTests(testResults: List<String>): List<String> {
        return testResults.filter { it.contains("FAIL") || it.contains("FLAKY") }
      }
    `
    const testCases = [
      {
        name: 'Filters FAIL and FLAKY',
        call: 'getProblematicTests(["LOGIN_PASS", "PAYMENT_FAIL", "CART_FLAKY", "PROFILE_PASS"])',
        expected: ["PAYMENT_FAIL", "CART_FLAKY"]
      },
      {
        name: 'Empty on all pass',
        call: 'getProblematicTests(["T1_PASS", "T2_PASS"])',
        expected: []
      }
    ]

    const jReport = verifyJvmChallenge({ code: javaCode, language: 'java', testCases })
    const kReport = verifyJvmChallenge({ code: kotlinCode, language: 'kotlin', testCases })

    expect(jReport.allPassed).toBe(true)
    expect(jReport.passedCount).toBe(2)
    expect(kReport.allPassed).toBe(true)
    expect(kReport.passedCount).toBe(2)
  })
})
